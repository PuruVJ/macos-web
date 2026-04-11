<script lang="ts">
	import { onMount } from 'svelte';
	import { sleep } from '🍎/helpers/sleep';
	import { get_app_icon_path } from '🍎/configs/apps/app-icons.config.ts';
	import type { AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { spring } from '🍎/state/spring.svelte.ts';
	import { should_show_notch } from '🍎/state/menubar.svelte.ts';
	import { apps } from '🍎/state/apps.svelte.ts';
	import {
		add_proxy_install,
		get_proxy_install_from_id,
		is_proxy_app_id,
		load_proxy_installs,
		proxy_apps,
		type ProxyInstall,
	} from '🍎/state/proxy-apps.svelte';
	import { can_add_to_dock, get_dock_app_count } from '🍎/configs/apps/runtime-apps';
	import embed_html from '../../../../staticsjv2/embed.html?raw';

	const { app_id }: { app_id: AppID } = $props();

	const motion_val = spring(0, { damping: 0.28, stiffness: 0.1 });

	onMount(async () => {
		await sleep(100);

		motion_val.value = 1;
	});

	const image_transform = $derived(
		!preferences.reduced_motion
			? `rotate(${180 * (motion_val.value + 1)}deg) scale(${motion_val.value}) translateZ(0px)`
			: 'initial',
	);

	const is_app_installer = $derived(app_id === 'appstore');
	const is_settings = $derived(app_id === 'system-preferences');

	const base_url = import.meta.env.BASE_URL;
	const default_installables: ProxyInstall[] = [
		{ id: 'proxy:lcc-math', title: 'LCC Math', target_url: 'https://lcc-math.pages.dev' },
		{ id: 'proxy:example', title: 'Example', target_url: 'https://example.com' },
	];

	const current_installations = $state<Record<string, boolean>>({});
	let custom_title = $state('');
	let custom_url = $state('');
	let install_error = $state('');
	let active_proxy = $state<ProxyInstall | null>(null);
	let active_srcdoc = $state<string | null>(null);
	let proxy_wisp = $state('');
	let custom_wisp = $state('');
	let custom_wisp_error = $state('');
	let custom_wisps = $state<string[]>([]);
	let proxy_autoswitch = $state(true);
	const selected_proxy_install = $derived(
		is_proxy_app_id(app_id) ? get_proxy_install_from_id(app_id) ?? null : null,
	);
	
	const dock_app_count = $derived(get_dock_app_count());
	const can_add_more_to_dock = $derived(can_add_to_dock());

	function normalize_url(input: string): string | null {
		const maybe_url = input.trim();
		if (!maybe_url) return null;
		const with_scheme = /^[a-z]+:\/\//i.test(maybe_url) ? maybe_url : `https://${maybe_url}`;

		try {
			const parsed = new URL(with_scheme);
			return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
		} catch {
			return null;
		}
	}

	function normalize_wisp_url(input: string): string | null {
		const maybe_url = input.trim();
		if (!maybe_url) return null;

		try {
			const parsed = new URL(maybe_url);
			return parsed.protocol === 'wss:' ? parsed.toString() : null;
		} catch {
			return null;
		}
	}

	function create_embed_srcdoc(target_url: string): string {
		const base_href = `${window.location.origin}${base_url}staticsjv2/`;
		const startup_script = `<script>window.location.hash = ${JSON.stringify(target_url)};<\/script>`;
		const with_base = embed_html.replace('<head>', `<head><base href="${base_href}">`);
		return with_base.replace('<body>', `<body>${startup_script}`);
	}

	function add_install(install: ProxyInstall) {
		if (proxy_apps.installs.some((app) => app.title === install.title || app.target_url === install.target_url)) {
			return;
		}

		add_proxy_install({
			title: install.title,
			target_url: install.target_url,
		});
		current_installations[install.title] = true;
	}

	function install_default_app(install: ProxyInstall) {
		if (!can_add_more_to_dock) {
			install_error = `Dock is full (max ${dock_app_count}/4 apps). Install anyway - app will be accessible via Finder.`;
			return;
		}
		add_install(install);
	}

	function install_custom_app() {
		install_error = '';
		
		if (!can_add_more_to_dock) {
			const confirmed = confirm(`Dock is full (max 4 apps). The app will be installed but only accessible via Finder. Continue?`);
			if (!confirmed) return;
		}
		
		const normalized_url = normalize_url(custom_url);

		if (!normalized_url) {
			install_error = 'Please enter a valid URL or domain.';
			return;
		}

		add_install({
			id: '',
			title: custom_title.trim() || new URL(normalized_url).hostname,
			target_url: normalized_url,
		});

		custom_title = '';
		custom_url = '';
	}

	function open_proxy_app(install: ProxyInstall) {
		active_proxy = install;
		active_srcdoc = create_embed_srcdoc(install.target_url);
	}

	function launch_installed_proxy_app(install: ProxyInstall) {
		apps.open[install.id] = true;
		apps.active = install.id;
	}

	function close_proxy_app() {
		active_proxy = null;
		active_srcdoc = null;
	}

	function load_proxy_settings() {
		if (typeof window === 'undefined') return;
		proxy_wisp = localStorage.getItem('proxServer') ?? '';
		custom_wisps = JSON.parse(localStorage.getItem('customWisps') ?? '[]');
		proxy_autoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
	}

	function save_proxy_settings() {
		if (typeof window === 'undefined') return;
		const normalized_wisp = normalize_wisp_url(proxy_wisp);
		if (proxy_wisp.trim() && !normalized_wisp) return;

		if (normalized_wisp) {
			localStorage.setItem('proxServer', normalized_wisp);
			proxy_wisp = normalized_wisp;
		} else {
			localStorage.removeItem('proxServer');
			proxy_wisp = '';
		}

		localStorage.setItem('customWisps', JSON.stringify(custom_wisps));
		localStorage.setItem('wispAutoswitch', String(proxy_autoswitch));
	}

	function add_custom_wisp() {
		custom_wisp_error = '';
		const normalized_wisp = normalize_wisp_url(custom_wisp);
		if (!normalized_wisp) {
			custom_wisp_error = 'Please enter a valid secure websocket URL (wss://...)';
			return;
		}
		if (custom_wisps.includes(normalized_wisp)) return;
		custom_wisps = [...custom_wisps, normalized_wisp];
		custom_wisp = '';
		save_proxy_settings();
	}

	function remove_custom_wisp(wisp: string) {
		custom_wisps = custom_wisps.filter((entry) => entry !== wisp);
		save_proxy_settings();
	}

	$effect(() => {
		if (!selected_proxy_install) return;
		open_proxy_app(selected_proxy_install);
	});

	onMount(() => {
		load_proxy_installs();
		load_proxy_settings();
		const saved_installs = proxy_apps.installs;

		for (const app of default_installables) {
			current_installations[app.title] = saved_installs.some((saved) => saved.title === app.title);
		}

		if (selected_proxy_install) {
			open_proxy_app(selected_proxy_install);
		}
	});
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle"></header>
	<section class="main-area">
		{#if selected_proxy_install && active_srcdoc}
			<section class="embed-container fullscreen">
				<div class="embed-toolbar">
					<strong>{selected_proxy_install.title}</strong>
					<span>{selected_proxy_install.target_url}</span>
				</div>
				<iframe title={selected_proxy_install.title} srcdoc={active_srcdoc}></iframe>
			</section>
		{:else if is_app_installer}
			<h1>App Installer</h1>
			<p>Install proxy apps and run them inside an embedded app container.</p>
			{#if !can_add_more_to_dock}
				<div class="dock-limit-notice">
					<p><strong>Dock Limit Reached:</strong> You can have up to 4 apps in the dock. Additional apps will be installed but only accessible via Finder.</p>
				</div>
			{/if}
			<div class="cards">
				{#each default_installables as app}
					<article class="card">
						<h2>{app.title}</h2>
						<p class="meta">{app.target_url}</p>
						<div class="actions">
							<button 
								onclick={() => install_default_app(app)} 
								disabled={current_installations[app.title]}
								class:dock-full={!can_add_more_to_dock && !current_installations[app.title]}
							>
								{current_installations[app.title] ? 'Installed' : 'Install'}
							</button>
							<button onclick={() => open_proxy_app(app)}>Open</button>
						</div>
					</article>
				{/each}
			</div>
			<div class="custom-install">
				<h2>Install Custom Proxy App</h2>
				<div class="form-row">
					<input type="text" placeholder="App name (optional)" bind:value={custom_title} />
					<input type="text" placeholder="URL or domain (ex: lcc-math.pages.dev)" bind:value={custom_url} />
					<button onclick={install_custom_app} class:dock-full={!can_add_more_to_dock}>Install</button>
				</div>
				{#if install_error}
					<p class="error">{install_error}</p>
				{/if}
			</div>
			{#if proxy_apps.installs.length}
				<div class="cards installed-list">
					{#each proxy_apps.installs as app}
						<article class="card">
							<h2>{app.title}</h2>
							<p class="meta">{app.target_url}</p>
							<div class="actions">
								<button onclick={() => open_proxy_app(app)}>Launch</button>
								<button onclick={() => launch_installed_proxy_app(app)}>Open App Window</button>
							</div>
						</article>
					{/each}
				</div>
			{/if}
			{#if active_proxy && active_srcdoc}
				<section class="embed-container">
					<div class="embed-toolbar">
						<strong>{active_proxy.title}</strong>
						<span>{active_proxy.target_url}</span>
						<button onclick={close_proxy_app}>Close</button>
					</div>
					<iframe title={active_proxy.title} srcdoc={active_srcdoc}></iframe>
				</section>
			{/if}
		{:else if is_settings}
			<h1>Settings</h1>
			<div class="cards settings-grid">
				<label class="setting-row">
					<span>Dark Mode</span>
					<input
						type="checkbox"
						checked={preferences.theme.scheme === 'dark'}
						onchange={(event) =>
							(preferences.theme.scheme = (event.currentTarget as HTMLInputElement).checked
								? 'dark'
								: 'light')}
					/>
				</label>
				<label class="setting-row">
					<span>Reduce Motion</span>
					<input type="checkbox" bind:checked={preferences.reduced_motion} />
				</label>
				<label class="setting-row">
					<span>Show Notch</span>
					<input type="checkbox" bind:checked={should_show_notch.value} />
				</label>
				<div class="setting-panel">
					<h2>Proxy/Wisp Settings</h2>
					<p class="meta">
						These are used by installed proxy apps. Open app windows use each app's saved URL automatically.
					</p>
					<div class="form-row wisp-row">
						<input type="text" placeholder="Default wisp (wss://...)" bind:value={proxy_wisp} />
						<button onclick={save_proxy_settings}>Save</button>
					</div>
					<label class="setting-row">
						<span>Auto-switch Wisps</span>
						<input
							type="checkbox"
							bind:checked={proxy_autoswitch}
							onchange={() => save_proxy_settings()}
						/>
					</label>
					<div class="form-row wisp-row">
						<input type="text" placeholder="Add custom wisp (wss://...)" bind:value={custom_wisp} />
						<button onclick={add_custom_wisp}>Add</button>
					</div>
					{#if custom_wisp_error}
						<p class="error">{custom_wisp_error}</p>
					{/if}
					{#if custom_wisps.length}
						<ul class="wisp-list">
							{#each custom_wisps as wisp}
								<li>
									<span>{wisp}</span>
									<button onclick={() => remove_custom_wisp(wisp)}>Remove</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{:else}
			<img
				style:transform={image_transform}
				src={get_app_icon_path(app_id)}
				alt="Placeholder App"
			/>

			<br />

			<h1 style:display="flex" style:align-items="center" style:gap="0.5rem">
				Nothing here yet <img
					style="height: 1em; width: auto; transform: translateY(0.1em);"
					src="/emojis/wink.png"
					alt="Wink Emoji"
				/>
			</h1>
		{/if}
	</section>
</section>

<style>
	.container {
		background: linear-gradient(135deg, 
			hsla(var(--system-color-light-hsl), 0.95) 0%, 
			hsla(var(--system-color-light-hsl), 0.85) 100%);
		border-radius: inherit;
	}

	.titlebar {
		padding: 1rem 1rem;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(180deg, 
			hsla(var(--system-color-light-hsl), 0.9) 0%, 
			hsla(var(--system-color-light-hsl), 0.7) 100%);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: inherit border-radius inherit 0 0;
	}

	.main-area {
		font-size: 1.618rem;
		color: var(--system-color-light-contrast);

		height: 100%;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 1.5rem;
		padding: 3rem 2rem 2rem;
		overflow: auto;
	}

	img {
		max-width: 8rem;
		aspect-ratio: 1 / 1;
		filter: drop-shadow(0 4px 8px hsla(var(--system-color-dark-hsl), 0.2));
	}

	h1 {
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
		width: min(900px, 100%);
		max-width: 100%;
	}

	.card {
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 1rem;
		padding: 1.25rem;
		font-size: 1rem;
		background: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(10px);
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px hsla(var(--system-color-dark-hsl), 0.08);
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px hsla(var(--system-color-dark-hsl), 0.12);
		border-color: hsla(var(--system-color-dark-hsl), 0.2);
	}

	.card h2 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--system-color-light-contrast);
	}

	.meta {
		font-size: 0.85rem;
		margin-bottom: 1rem;
		opacity: 0.65;
		word-break: break-all;
		line-height: 1.4;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.6rem 1rem;
		border-radius: 0.625rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		background: linear-gradient(180deg, 
			hsla(var(--system-color-light-hsl), 0.9) 0%, 
			hsla(var(--system-color-light-hsl), 0.7) 100%);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: 0 1px 3px hsla(var(--system-color-dark-hsl), 0.1);
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 2px 6px hsla(var(--system-color-dark-hsl), 0.15);
		background: linear-gradient(180deg, 
			hsla(var(--system-color-light-hsl), 0.95) 0%, 
			hsla(var(--system-color-light-hsl), 0.8) 100%);
	}

	button:active:not(:disabled) {
		transform: translateY(0);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	input {
		padding: 0.6rem 0.85rem;
		border-radius: 0.625rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		background: hsla(var(--system-color-light-hsl), 0.6);
		font-size: 0.9rem;
		transition: all 0.15s ease;
	}

	input:focus {
		outline: none;
		border-color: hsla(var(--system-color-dark-hsl), 0.3);
		box-shadow: 0 0 0 3px hsla(var(--system-color-dark-hsl), 0.1);
	}

	.custom-install {
		width: min(720px, 100%);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		background: hsla(var(--system-color-light-hsl), 0.4);
		backdrop-filter: blur(10px);
		box-shadow: 0 2px 8px hsla(var(--system-color-dark-hsl), 0.08);
	}

	.custom-install h2 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 2fr auto;
		gap: 0.5rem;
	}

	.error {
		margin-top: 0.75rem;
		color: #cc2f2f;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.installed-list {
		margin-top: 1rem;
	}

	.embed-container {
		width: min(100%, 960px);
		height: min(60vh, 720px);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		border-radius: 1rem;
		overflow: hidden;
		background: #000;
		display: grid;
		grid-template-rows: auto 1fr;
		box-shadow: 0 4px 24px hsla(var(--system-color-dark-hsl), 0.15);
	}

	.fullscreen {
		height: min(80vh, 860px);
	}

	.embed-toolbar {
		font-size: 0.85rem;
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		background: hsla(var(--system-color-light-hsl), 0.9);
	}

	.embed-toolbar strong {
		font-weight: 600;
	}

	.embed-toolbar span {
		opacity: 0.7;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}

	.settings-grid {
		grid-template-columns: 1fr;
		max-width: 600px;
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 1rem;
		padding: 0.875rem 1.25rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 0.875rem;
		background: hsla(var(--system-color-light-hsl), 0.3);
		transition: all 0.15s ease;
	}

	.setting-row:hover {
		background: hsla(var(--system-color-light-hsl), 0.5);
	}

	.setting-panel {
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 1rem;
		padding: 1.25rem;
		font-size: 1rem;
		background: hsla(var(--system-color-light-hsl), 0.3);
	}

	.setting-panel h2 {
		font-size: 1.05rem;
		margin-bottom: 0.75rem;
		font-weight: 600;
	}

	.wisp-row {
		grid-template-columns: 1fr auto;
		margin-top: 0.75rem;
	}

	.wisp-list {
		margin-top: 1rem;
		display: grid;
		gap: 0.5rem;
	}

	.wisp-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 0.625rem;
		padding: 0.625rem 0.75rem;
		background: hsla(var(--system-color-light-hsl), 0.4);
	}

	.wisp-list span {
		font-size: 0.85rem;
		opacity: 0.8;
		word-break: break-all;
	}

	/* Section headers */
	.main-area > h1:first-of-type,
	.main-area > p:first-of-type {
		text-align: center;
		max-width: 600px;
	}

	.main-area > p:first-of-type {
		font-size: 1.1rem;
		opacity: 0.8;
		margin-top: -0.5rem;
	}

	/* Dock limit notice */
	.dock-limit-notice {
		width: min(720px, 100%);
		padding: 1rem 1.25rem;
		background: hsla(24, 85%, 50%, 0.15);
		border: 1px solid hsla(24, 85%, 50%, 0.3);
		border-radius: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.dock-limit-notice p {
		font-size: 0.9rem;
		color: var(--system-color-light-contrast);
		margin: 0;
		line-height: 1.5;
	}

	/* Dock full button style */
	button.dock-full {
		background: linear-gradient(180deg, 
			hsla(24, 85%, 50%, 0.9) 0%, 
			hsla(24, 85%, 45%, 0.8) 100%);
		border-color: hsla(24, 85%, 50%, 0.4);
		color: white;
	}

	button.dock-full:hover:not(:disabled) {
		background: linear-gradient(180deg, 
			hsla(24, 85%, 55%, 0.95) 0%, 
			hsla(24, 85%, 50%, 0.85) 100%);
	}
</style>
