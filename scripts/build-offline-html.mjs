import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const inputHtml = join(distDir, 'index.html');
const outputHtml = join(distDir, 'offline.html');

if (!existsSync(inputHtml)) {
	console.error('Missing dist/index.html. Run the Vite build first.');
	process.exit(1);
}

const MIME_TYPES = {
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.css': 'text/css',
	'.html': 'text/html',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
	'.avif': 'image/avif',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.otf': 'font/otf',
	'.mp3': 'audio/mpeg',
};

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'avif'];

const isRemote = (value) =>
	/^(?:[a-z]+:)?\/\//i.test(value) ||
	value.startsWith('data:') ||
	value.startsWith('#') ||
	value.startsWith('blob:');

function resolveLocalPath(value, baseDir) {
	if (!value || isRemote(value)) return null;
	const clean = value.split('?')[0].split('#')[0];
	if (clean.startsWith('/')) return join(distDir, clean.slice(1));
	return resolve(baseDir, clean);
}

function toDataUri(filePath) {
	const ext = extname(filePath).toLowerCase();
	const mime = MIME_TYPES[ext] ?? 'application/octet-stream';
	const data = readFileSync(filePath);
	return `data:${mime};base64,${data.toString('base64')}`;
}

function inlineCssAssets(css, cssDir) {
	return css.replace(/url\(([^)]+)\)/g, (match, raw) => {
		const value = raw.trim().replace(/^['"]|['"]$/g, '');
		if (!value || isRemote(value)) return match;

		const assetPath = resolveLocalPath(value, cssDir);
		if (!assetPath || !existsSync(assetPath)) return match;

		return `url(${toDataUri(assetPath)})`;
	});
}

function inlineImageReferencesInText(text, baseDir) {
	const imagePath = IMAGE_EXTENSIONS.join('|');
	const imagePathRegex = new RegExp(
		String.raw`(["'\`])((?:\.{0,2}\/|\/)[^"'\`\s)]+\.(?:${imagePath})(?:\?[^"'\`\s)]*)?)(\1)`,
		'gi',
	);

	return text.replace(imagePathRegex, (full, quote, pathValue, endQuote) => {
		if (isRemote(pathValue)) return full;
		const assetPath = resolveLocalPath(pathValue, baseDir);
		if (!assetPath || !existsSync(assetPath)) return full;
		return `${quote}${toDataUri(assetPath)}${endQuote}`;
	});
}

function inlineSrcsetValue(srcset, baseDir) {
	const candidates = srcset.split(',').map((entry) => entry.trim()).filter(Boolean);
	if (!candidates.length) return srcset;

	const updated = candidates.map((candidate) => {
		const [urlPart, descriptor] = candidate.split(/\s+/, 2);
		if (!urlPart || isRemote(urlPart)) return candidate;
		const assetPath = resolveLocalPath(urlPart, baseDir);
		if (!assetPath || !existsSync(assetPath)) return candidate;
		const dataUri = toDataUri(assetPath);
		return descriptor ? `${dataUri} ${descriptor}` : dataUri;
	});

	return updated.join(', ');
}

let html = readFileSync(inputHtml, 'utf8');
const htmlDir = dirname(inputHtml);

// Inline CSS
html = html.replace(/<link([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, (full, before, href, after) => {
	if (isRemote(href) || !/rel=["']stylesheet["']/i.test(full)) return full;
	const cssPath = resolveLocalPath(href, htmlDir);
	if (!cssPath || !existsSync(cssPath)) return full;
	let css = readFileSync(cssPath, 'utf8');
	css = inlineCssAssets(css, dirname(cssPath));
	return `<style data-inline-source="${href}">${css}</style>`;
});

// Inline JS
html = html.replace(/<script([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/gi, (full, before, src, after) => {
	if (isRemote(src)) return full;
	const scriptPath = resolveLocalPath(src, htmlDir);
	if (!scriptPath || !existsSync(scriptPath)) return full;
	let js = readFileSync(scriptPath, 'utf8');
	js = inlineImageReferencesInText(js, dirname(scriptPath));
	const attrs = `${before ?? ''}${after ?? ''}`.replace(/\s*crossorigin(?:=["'][^"']*["'])?/gi, '');
	return `<script${attrs} data-inline-source="${src}">${js}</script>`;
});

// Inline media src
html = html.replace(/<(img|source|video|audio)\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*?)>/gi, (full, tag, before, src, after) => {
	if (isRemote(src)) return full;
	const assetPath = resolveLocalPath(src, htmlDir);
	if (!assetPath || !existsSync(assetPath)) return full;
	return `<${tag}${before}src="${toDataUri(assetPath)}"${after}>`;
});

// Inline srcset
html = html.replace(/<(img|source|video)\b([^>]*?)\bsrcset=["']([^"']+)["']([^>]*?)>/gi, (full, tag, before, srcset, after) => {
	const updatedSrcset = inlineSrcsetValue(srcset, htmlDir);
	return `<${tag}${before}srcset="${updatedSrcset}"${after}>`;
});

// Inline other links
html = html.replace(/<link([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, (full, before, href, after) => {
	if (isRemote(href)) return full;
	if (/rel=["']stylesheet["']/i.test(full)) return full;
	const assetPath = resolveLocalPath(href, htmlDir);
	if (!assetPath || !existsSync(assetPath)) return full;
	return `<link${before}href="${toDataUri(assetPath)}"${after}>`;
});

// Final pass for inline images in HTML text
html = inlineImageReferencesInText(html, htmlDir);

writeFileSync(outputHtml, html, 'utf8');
console.log(`Wrote offline single-file HTML: ${outputHtml}`);