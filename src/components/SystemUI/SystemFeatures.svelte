<script lang="ts">
	import { onMount } from 'svelte';
	import { apps } from '🍎/state/apps.svelte.ts';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	type Mode = '' | 'launchpad' | 'spotlight' | 'mission-control' | 'notifications' | 'control-center';
	type Settings = { brightness: number; volume: number; wifi: boolean; bluetooth: boolean; focus: boolean; nightShift: boolean };

	const defaults: Settings = { brightness: 1, volume: 0.65, wifi: true, bluetooth: true, focus: false, nightShift: false };
	let mode = $state<Mode>('');
	let query = $state('');
	let searchInput: HTMLInputElement;
	let settings = $state<Settings>({ ...defaults });
	let events = $state<{ title: string; message: string }[]>([]);

	const appEntries = $derived(Object.entries(apps_config).filter(([, config]) => !config.disabled));
	const filteredApps = $derived(appEntries.filter(([id, config]) => `${id} ${config.title}`.toLowerCase().includes(query.toLowerCase())));
	const openApps = $derived(Object.entries(apps.open).filter(([, open]) => open).map(([id]) => [id, apps_config[id]] as const).filter(([, config]) => !!config));

	function saveSettings() {
		try { localStorage.setItem('macos-web-system', JSON.stringify(settings)); } catch {}
	}

	function notify(title: string, message: string) {
		events = [{ title, message }, ...events].slice(0, 6);
	}

	function setBrightness(value: number) {
		settings.brightness = Math.max(0.35, Math.min(1.2, value));
		saveSettings();
		notify('Display', `Brightness ${Math.round(settings.brightness * 100)}%`);
	}

	function setVolume(value: number) {
		settings.volume = Math.max(0, Math.min(1, value));
		document.querySelectorAll<HTMLMediaElement>('audio, video').forEach((media) => { media.volume = settings.volume; });
		saveSettings();
	}

	function toggle(key: 'wifi' | 'bluetooth' | 'focus' | 'nightShift') {
		settings[key] = !settings[key];
		saveSettings();
		const labels = { wifi: 'Wi‑Fi', bluetooth: 'Bluetooth', focus: 'Focus', nightShift: 'Night Shift' };
		notify(labels[key], settings[key] ? 'Ativado' : 'Desativado');
	}

	function openOverlay(next: Mode) {
		mode = mode === next ? '' : next;
		if (next === 'spotlight') {
			query = '';
			setTimeout(() => searchInput?.focus(), 0);
		}
	}

	function openApp(id: keyof typeof apps_config) {
		apps.open[id] = true;
		apps.active = id;
		mode = '';
		notify(apps_config[id].title, 'Aplicativo aberto');
	}

	function closeTopApp() {
		const openIds = Object.keys(apps.open).filter((id) => apps.open[id as keyof typeof apps.open]);
		const current = openIds[openIds.length - 1] as keyof typeof apps_config | undefined;
		if (current) {
			apps.open[current] = false;
			notify(apps_config[current].title, 'Aplicativo fechado');
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.code === 'Space') {
			event.preventDefault(); openOverlay('spotlight'); return;
		}
		if (event.code === 'F4') { event.preventDefault(); openOverlay('launchpad'); return; }
		if (event.code === 'F3') { event.preventDefault(); openOverlay('mission-control'); return; }
		if (event.code === 'F2') { event.preventDefault(); openOverlay('control-center'); return; }
		if (event.code === 'Escape') { mode = ''; return; }
		if ((event.metaKey || event.ctrlKey) && event.code === 'KeyW') { event.preventDefault(); closeTopApp(); }
	}

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('macos-web-system') || 'null');
			if (saved) settings = { ...defaults, ...saved };
		} catch {}
		setVolume(settings.volume);
		const overlayHandler = (event: Event) => openOverlay((event as CustomEvent<Mode>).detail);
		window.addEventListener('macos:system-overlay', overlayHandler);
		window.addEventListener('keydown', onKeydown);
		return () => {
			window.removeEventListener('macos:system-overlay', overlayHandler);
			window.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div class="system-effects" class:night-shift={settings.nightShift} style={`--web-brightness:${settings.brightness}`} aria-hidden="true"></div>

{#if mode}
	<div class="overlay" onclick={(event) => event.currentTarget === event.target && (mode = '')}>
		{#if mode === 'spotlight'}
			<section class="spotlight glass">
				<div class="search-row"><span class="search-icon">⌕</span><input bind:this={searchInput} bind:value={query} placeholder="Spotlight Search" aria-label="Spotlight Search" /></div>
				{#if query}
					<div class="results">
						{#each filteredApps.slice(0, 8) as [id, config]}
							<button onclick={() => openApp(id as keyof typeof apps_config)}>
								<img src={`${import.meta.env.BASE_URL}app-icons/${config.icon}/64.webp`} alt="" /><span>{config.title}</span><small>Application</small>
							</button>
						{/each}
					</div>
				{:else}<div class="hint">Search apps, settings and files</div>{/if}
			</section>
		{:else if mode === 'launchpad'}
			<section class="launchpad glass">
				<div class="launch-head"><h1>Launchpad</h1><button onclick={() => (mode = '')}>×</button></div>
				<div class="launch-grid">{#each appEntries as [id, config]}<button class="launch-item" onclick={() => openApp(id as keyof typeof apps_config)}><img class="app-glyph" src={`${import.meta.env.BASE_URL}app-icons/${config.icon}/256.png`} alt="" /><span>{config.title}</span></button>{/each}</div>
			</section>
		{:else if mode === 'mission-control'}
			<section class="mission">
				<div class="spaces glass"><span class="space active">Desktop</span><span class="space">Desktop 2</span><button class="space" onclick={() => notify('Mission Control', 'Novo Desktop criado')}>＋ New Desktop</button></div>
				<div class="window-grid">{#each openApps as [id, config]}<button class="window-card glass" onclick={() => openApp(id as keyof typeof apps_config)}><div class="window-top"><span>{config.title}</span><span>● ● ●</span></div><div class="window-preview"><img src={`${import.meta.env.BASE_URL}app-icons/${config.icon}/256.png`} alt="" /><span>{config.title}</span></div></button>{/each}</div>
			</section>
		{:else if mode === 'control-center'}
			<section class="control-center glass">
				<div class="panel-title"><strong>Control Center</strong><button onclick={() => (mode = '')}>×</button></div>
				<div class="tiles">
					<button class:enabled={settings.wifi} onclick={() => toggle('wifi')}><strong>Wi‑Fi</strong><small>{settings.wifi ? 'Connected' : 'Off'}</small></button>
					<button class:enabled={settings.bluetooth} onclick={() => toggle('bluetooth')}><strong>Bluetooth</strong><small>{settings.bluetooth ? 'On' : 'Off'}</small></button>
					<button class:enabled={settings.focus} onclick={() => toggle('focus')}><strong>Focus</strong><small>{settings.focus ? 'On' : 'Off'}</small></button>
					<button class:enabled={settings.nightShift} onclick={() => toggle('nightShift')}><strong>Night Shift</strong><small>{settings.nightShift ? 'On' : 'Off'}</small></button>
				</div>
				<label>Brightness <input type="range" min="0.35" max="1.2" step="0.01" value={settings.brightness} oninput={(e) => setBrightness(Number(e.currentTarget.value))} /></label>
				<label>Volume <input type="range" min="0" max="1" step="0.01" value={settings.volume} oninput={(e) => setVolume(Number(e.currentTarget.value))} /></label>
			</section>
		{:else}
			<section class="notifications glass">
				<div class="panel-title"><strong>Notifications</strong><button onclick={() => (mode = '')}>×</button></div>
				{#if events.length === 0}<article><small>macOS Web</small><h3>Welcome back</h3><p>Your desktop is ready.</p></article>{/if}
				{#each events as event}<article><small>{event.title}</small><h3>{event.message}</h3><p>Agora mesmo</p></article>{/each}
			</section>
		{/if}
	</div>
{/if}

<style>
	.system-effects{position:fixed;inset:0;z-index:1;pointer-events:none;background:rgba(255,255,255,calc((var(--web-brightness) - 1) * .35));mix-blend-mode:screen;transition:background .2s}.night-shift{background:rgba(255,160,60,.12)!important;mix-blend-mode:multiply}
	.overlay{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:7vh 4vw;background:rgba(0,0,0,.16);backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%)}
	.glass{background:linear-gradient(180deg,rgba(255,255,255,.24),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.32);box-shadow:0 26px 70px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.34);backdrop-filter:blur(28px) saturate(150%);-webkit-backdrop-filter:blur(28px) saturate(150%);color:var(--system-color-light-contrast)}
	.spotlight{width:min(720px,92vw);border-radius:1.35rem;overflow:hidden}.search-row{display:flex;align-items:center;gap:.7rem;padding:1rem 1.2rem}.search-icon{font-size:1.35rem;opacity:.6}.search-row input{flex:1;background:transparent;border:0;outline:0;font-size:1.2rem;color:inherit}.hint{padding:1rem 1.2rem 1.25rem;opacity:.55}.results{border-top:1px solid rgba(255,255,255,.14);padding:.35rem}.results button{display:grid;grid-template-columns:2rem 1fr auto;align-items:center;gap:.7rem;width:100%;padding:.7rem;border-radius:.7rem;text-align:left;color:inherit}.results button:hover{background:rgba(255,255,255,.14)}.results img{width:2rem;height:2rem;border-radius:.52rem}.results small{opacity:.5}
	.launchpad{width:min(1000px,94vw);max-height:84vh;overflow:auto;border-radius:1.8rem;padding:1.4rem}.launch-head,.panel-title{display:flex;justify-content:space-between;align-items:center}.launch-head h1{margin:.2rem 0 1.2rem}.launch-head button,.panel-title button{border:0;background:rgba(255,255,255,.16);border-radius:50%;width:2rem;height:2rem;color:inherit}.launch-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:1.4rem}.launch-item{display:grid;gap:.45rem;justify-items:center;color:inherit}.app-glyph{width:4.4rem;height:4.4rem;object-fit:contain;border-radius:1.15rem;filter:drop-shadow(0 8px 16px rgba(0,0,0,.14))}.launch-item span{font-size:.78rem}
	.mission{width:min(1100px,94vw);height:100%;display:grid;grid-template-rows:auto 1fr;gap:1rem}.spaces{justify-self:center;padding:.5rem;border-radius:1rem;display:flex;gap:.35rem}.space{padding:.45rem .75rem;border-radius:.7rem;font-size:.75rem;opacity:.7;color:inherit;border:0;background:transparent}.space.active{background:rgba(255,255,255,.2);opacity:1}.window-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.2rem;align-content:start}.window-card{border-radius:1.2rem;overflow:hidden;padding:0}.window-top{display:flex;justify-content:space-between;padding:.7rem .8rem;font-size:.76rem}.window-preview{height:180px;display:grid;place-items:center;gap:.5rem;background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,.06));font-size:.85rem}.window-preview img{width:4rem;height:4rem;object-fit:contain}
	.control-center{width:min(430px,92vw);border-radius:1.35rem;padding:1rem}.tiles{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin:.8rem 0}.tiles button{display:flex;flex-direction:column;align-items:flex-start;gap:.2rem;padding:.9rem;border:0;border-radius:1rem;color:inherit;background:rgba(255,255,255,.09);text-align:left}.tiles button.enabled{background:rgba(70,140,255,.24)}.tiles small{opacity:.6}.control-center label{display:grid;gap:.35rem;padding:.45rem 0;font-size:.8rem}.control-center input{width:100%}
	.notifications{width:min(390px,92vw);align-self:start;justify-self:end;margin-top:2rem;border-radius:1.25rem;padding:.75rem}.notifications article{padding:.9rem;border-radius:.9rem;background:rgba(255,255,255,.11);margin-top:.55rem}.notifications small{opacity:.5}.notifications h3{margin:.2rem 0;font-size:.92rem}.notifications p{margin:0;opacity:.65;font-size:.78rem}
	@media(max-width:700px){.launch-grid{grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:1rem}.app-glyph{width:3.8rem;height:3.8rem}}
</style>
