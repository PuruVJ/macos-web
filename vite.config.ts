import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig, type Plugin } from 'vite';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { prefetch } from './prefetch-plugin';


const copy_staticsjv2_plugin = (): Plugin => ({
	name: 'copy-staticsjv2',
	closeBundle() {
		const source_dir = resolve(__dirname, 'staticsjv2');
		const target_dir = resolve(__dirname, 'dist', 'staticsjv2');

		if (!existsSync(source_dir)) return;

		cpSync(source_dir, target_dir, { recursive: true, force: true });
	},
});


export default defineConfig({
	plugins: [
		svelte(),
		prefetch(),
		copy_staticsjv2_plugin(),

		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		VitePWA({
			includeAssets: [
				'robots.txt',
				'app-icons/finder/32.png',
				'cover-image.png',
				'cursors/(normal|link|text|help)-select.svg',
				'**/*.mp3',
			],
			manifest: {
				name: 'Mac OS Monterey Svelte Web',
				short_name: 'macOS Svelte',
				theme_color: '#ffffff',
				description: 'Mac OS Monterey Web written in Svelte',
				icons: [
					{
						src: 'app-icons/finder/128.png',
						sizes: '128x128',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		imagetools({}),
	],
	resolve: {
		alias: {
			'🍎': new URL('./src/', import.meta.url).pathname,
		},
	},
	build: {
		minify: 'terser',
		cssMinify: 'lightningcss',
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist('defaults, not IE 11, not IE_Mob 11, not dead')),
		},
	},
});
