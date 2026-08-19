<script lang="ts">
	let launcherOpen = false;
	let quickOpen = false;
	let notificationsOpen = false;
	let search = '';
	let wifi = true;
	let bluetooth = true;
	let dark = false;
	let volume = 72;
	let brightness = 80;
	type WindowName = 'browser' | 'files' | 'settings' | 'terminal' | 'about';
	let windows: WindowName[] = [];
	let active: WindowName | null = null;
	let minimized: WindowName[] = [];

	const apps: { id: WindowName; name: string; icon: string; color: string }[] = [
		{ id: 'browser', name: 'Chrome', icon: '🌐', color: '#4285f4' },
		{ id: 'files', name: 'Arquivos', icon: '📁', color: '#f9ab00' },
		{ id: 'settings', name: 'Configurações', icon: '⚙️', color: '#5f6368' },
		{ id: 'terminal', name: 'Terminal', icon: '›_', color: '#202124' },
		{ id: 'about', name: 'Sobre', icon: 'ℹ️', color: '#1a73e8' }
	];

	function openApp(id: WindowName) {
		if (!windows.includes(id)) windows = [...windows, id];
		minimized = minimized.filter((x) => x !== id);
		active = id;
		launcherOpen = false;
	}

	function closeApp(id: WindowName) {
		windows = windows.filter((x) => x !== id);
		minimized = minimized.filter((x) => x !== id);
		if (active === id) active = windows.at(-1) ?? null;
	}

	function minimizeApp(id: WindowName) {
		if (!minimized.includes(id)) minimized = [...minimized, id];
		if (active === id) active = windows.filter((x) => x !== id && !minimized.includes(x)).at(-1) ?? null;
	}

	function restoreApp(id: WindowName) {
		minimized = minimized.filter((x) => x !== id);
		active = id;
	}

	$: filteredApps = apps.filter((app) => app.name.toLowerCase().includes(search.toLowerCase()));
	$: now = new Date();
	$: time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
	$: date = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
</script>

<svelte:window on:keydown={(e) => { if (e.key === 'Escape') { launcherOpen = false; quickOpen = false; notificationsOpen = false; } }} />

<div class:dark class="chromeos">
	<div class="wallpaper"></div>
	<div class="desktop" on:click={() => { launcherOpen = false; quickOpen = false; notificationsOpen = false; }}>
		<div class="desktop-brand"><span class="chrome-logo">●</span><span>ChromeOS</span></div>
		<div class="desktop-hint">Tudo o que você precisa, direto no navegador.</div>

		{#each windows as id}
			{#if active === id && !minimized.includes(id)}
				<div class="window" class:browser-window={id === 'browser'} on:click|stopPropagation={() => active = id}>
					<div class="titlebar">
						<div class="traffic"><button aria-label="Fechar" on:click={() => closeApp(id)} class="close">×</button><button aria-label="Minimizar" on:click={() => minimizeApp(id)} class="min">−</button><button aria-label="Maximizar" on:click={() => active = id} class="max">□</button></div>
						<div class="window-title">{apps.find((a) => a.id === id)?.icon} {apps.find((a) => a.id === id)?.name}</div>
						<div></div>
					</div>
					{#if id === 'browser'}
						<div class="browser-toolbar"><button>←</button><button>→</button><button>↻</button><div class="omnibox">🔒 &nbsp; Pesquisa ou digite um endereço</div><button>⋮</button></div>
						<div class="browser-page"><div class="google-mark"><span>G</span></div><div class="google-search">Pesquisar na Web <span>⌕</span></div><div class="shortcuts"><button on:click={() => openApp('files')}>📁<small>Arquivos</small></button><button>➕<small>Adicionar atalho</small></button></div></div>
					{:else if id === 'files'}
						<div class="files-app"><aside><b>Arquivos</b><span>⌂ Meus arquivos</span><span>☁ Google Drive</span><span>⬇ Downloads</span></aside><section><h2>Meus arquivos</h2><div class="file-grid"><div>📁<small>Downloads</small></div><div>📁<small>Imagens</small></div><div>📁<small>Documentos</small></div><div>📄<small>Bem-vindo.txt</small></div></div></section></div>
					{:else if id === 'settings'}
						<div class="settings-app"><aside><h3>Configurações</h3><span>🌐 Rede</span><span>📶 Wi‑Fi</span><span>🎨 Personalização</span><span>🔒 Privacidade e segurança</span><span>ℹ️ Sobre o ChromeOS</span></aside><section><h2>Configurações</h2><label>Wi‑Fi <input type="checkbox" bind:checked={wifi}></label><label>Bluetooth <input type="checkbox" bind:checked={bluetooth}></label><label>Modo escuro <input type="checkbox" bind:checked={dark}></label></section></div>
					{:else if id === 'terminal'}
						<div class="terminal"><div>ChromeOS Web Terminal</div><div class="prompt">guest@chromeos:~$ <span>echo "Olá, ChromeOS!"</span></div><div>Olá, ChromeOS!</div><div class="prompt">guest@chromeos:~$ <i>_</i></div></div>
					{:else}
						<div class="about"><div class="big-logo">◉</div><h1>ChromeOS Web</h1><p>Uma experiência inspirada no ChromeOS, construída sobre o projeto macOS Web.</p><div class="version">Versão Web 1.0 · Svelte 5 · Vite</div></div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>

	{#if launcherOpen}
		<div class="launcher" on:click|stopPropagation>
			<div class="launcher-search">🔍<input autofocus bind:value={search} placeholder="Pesquisar apps, arquivos e configurações" /></div>
			<div class="app-grid">
				{#each filteredApps as app}<button class="app" on:click={() => openApp(app.id)}><span class="app-icon" style={`background:${app.color}`}>{app.icon}</span><span>{app.name}</span></button>{/each}
			</div>
			<div class="launcher-footer"><span>⌕ Pesquisar</span><span>Conta local</span></div>
		</div>
	{/if}

	{#if quickOpen}
		<div class="quick-panel" on:click|stopPropagation>
			<div class="quick-header"><div><b>Conta local</b><small>ChromeOS Web</small></div><button>⚙</button></div>
			<div class="toggles"><button class:on={wifi} on:click={() => wifi = !wifi}>📶<span>Wi‑Fi<small>{wifi ? 'Conectado' : 'Desativado'}</small></span></button><button class:on={bluetooth} on:click={() => bluetooth = !bluetooth}>ᛒ<span>Bluetooth<small>{bluetooth ? 'Ativado' : 'Desativado'}</small></span></button></div>
			<label class="slider">☀ <input type="range" bind:value={brightness} min="0" max="100" /> ☀</label><label class="slider">🔊 <input type="range" bind:value={volume} min="0" max="100" /> 🔊</label>
			<div class="quick-actions"><button on:click={() => dark = !dark}>{dark ? '☀' : '☾'} {dark ? 'Modo claro' : 'Modo escuro'}</button><button>🔒 Bloquear</button><button>⏻ Desligar</button></div>
		</div>
	{/if}

	{#if notificationsOpen}
		<div class="notifications" on:click|stopPropagation><b>Notificações</b><div class="empty">Tudo em dia 🎉<small>Não há novas notificações.</small></div></div>
	{/if}

	<div class="shelf">
		<button class="launcher-btn" aria-label="Abrir launcher" on:click|stopPropagation={() => launcherOpen = !launcherOpen}>◉</button>
		<div class="pinned">
			{#each apps.slice(0, 4) as app}<button class:running={windows.includes(app.id)} on:click|stopPropagation={() => openApp(app.id)} title={app.name}><span style={`background:${app.color}`}>{app.icon}</span></button>{/each}
		</div>
		<div class="shelf-spacer"></div>
		<div class="status-area"><button on:click|stopPropagation={() => notificationsOpen = !notificationsOpen}>🔔</button><button class="status" on:click|stopPropagation={() => quickOpen = !quickOpen}><span>📶</span><span>{wifi ? '⌁' : '×'}</span><span>🔋</span><b>{time}</b><small>{date}</small></button></div>
	</div>
</div>

<style>
	:global(html, body, #root) { width:100%; height:100%; margin:0; overflow:hidden; }
	:global(*) { box-sizing:border-box; }
	.chromeos { width:100%;height:100%;font-family:Arial,'Segoe UI',sans-serif;color:#202124;background:#202124;overflow:hidden;position:relative;user-select:none; }
	.dark { color:#e8eaed; }
	.wallpaper { position:absolute;inset:0;background:radial-gradient(circle at 20% 20%,#5f8dd3 0,#3568ae 25%,#183b69 55%,#071c35 100%); }
	.dark .wallpaper { background:radial-gradient(circle at 75% 25%,#374151,#172033 45%,#090e18 100%); }
	.desktop { position:absolute;inset:0;padding:34px; }
	.desktop-brand { color:rgba(255,255,255,.9);font-weight:600;font-size:15px;display:flex;align-items:center;gap:8px;text-shadow:0 1px 4px #0005; }
	.chrome-logo { display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:conic-gradient(#4285f4 0 25%,#34a853 0 50%,#fbbc05 0 75%,#ea4335 0);color:transparent; }
	.desktop-hint { color:#fff9;font-size:13px;margin:8px 0 0 28px; }
	.shelf { position:absolute;z-index:50;left:14px;right:14px;bottom:12px;height:64px;border-radius:20px;background:rgba(246,248,252,.88);backdrop-filter:blur(24px) saturate(1.4);box-shadow:0 8px 30px #0005;border:1px solid #fff8;display:flex;align-items:center;padding:8px;gap:8px; }
	.dark .shelf { background:rgba(36,40,49,.9);border-color:#ffffff12; }
	.shelf button { border:0;background:transparent;cursor:pointer;color:inherit; }
	.launcher-btn { width:48px;height:48px;border-radius:15px;font-size:26px;color:#1a73e8!important;background:#fff8!important; }
	.pinned { display:flex;gap:4px; }
	.pinned button { width:48px;height:48px;border-radius:14px;position:relative; }
	.pinned button:hover { background:#0000000c; }
	.pinned span { display:grid;place-items:center;width:38px;height:38px;border-radius:11px;margin:auto;font-size:20px;box-shadow:0 2px 5px #0002; }
	.pinned .running:after { content:'';position:absolute;bottom:2px;left:20px;width:6px;height:3px;border-radius:4px;background:#1a73e8; }
	.shelf-spacer { flex:1; }
	.status-area { display:flex;align-items:center;gap:3px; }
	.status-area>button { height:48px;border-radius:14px;padding:0 10px;font-size:16px; }
	.status-area>button:hover { background:#0000000c; }
	.status { display:flex;align-items:center;gap:7px!important; }
	.status b { font-size:13px;margin-left:4px; }
	.status small { display:none; }
	.window { position:absolute;z-index:20;left:50%;top:50%;transform:translate(-50%,-55%);width:min(820px,calc(100vw - 100px));height:min(560px,calc(100vh - 150px));background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 22px 70px #0007;border:1px solid #0002; }
	.dark .window { background:#202124;color:#e8eaed; }
	.titlebar { height:48px;display:grid;grid-template-columns:120px 1fr 120px;align-items:center;background:#f8f9fa;border-bottom:1px solid #dadce0; }
	.dark .titlebar { background:#292a2d;border-color:#3c4043; }
	.traffic { display:flex;gap:7px;padding-left:14px; }
	.traffic button { width:13px;height:13px;border-radius:50%;border:0;color:transparent;cursor:pointer; }
	.traffic .close { background:#ff5f57; }.traffic .min { background:#febc2e; }.traffic .max { background:#28c840; }
	.window-title { text-align:center;font-size:13px;font-weight:500; }
	.browser-toolbar { height:52px;display:flex;align-items:center;gap:6px;padding:7px 12px;background:#fff;border-bottom:1px solid #eee; }.dark .browser-toolbar{background:#292a2d;border-color:#3c4043}.browser-toolbar button{border:0;background:transparent;font-size:20px;padding:8px;cursor:pointer}.omnibox{flex:1;background:#f1f3f4;border-radius:24px;padding:10px 16px;font-size:13px;color:#5f6368}.dark .omnibox{background:#3c4043;color:#bdc1c6}
	.browser-page{height:calc(100% - 100px);display:flex;flex-direction:column;align-items:center;padding-top:95px;background:#fff}.dark .browser-page{background:#202124}.google-mark{font-size:72px;font-weight:600;margin-bottom:24px}.google-mark span{background:linear-gradient(90deg,#4285f4 25%,#34a853 25% 50%,#fbbc05 50% 75%,#ea4335 75%);background-clip:text;color:transparent}.google-search{width:min(580px,80%);border:1px solid #dfe1e5;border-radius:28px;padding:14px 20px;color:#777;box-shadow:0 1px 6px #0001}.shortcuts{display:flex;gap:15px;margin-top:28px}.shortcuts button{border:0;background:transparent;padding:15px;border-radius:10px;display:flex;flex-direction:column;gap:8px;align-items:center}.shortcuts button:hover{background:#f1f3f4}.shortcuts small{font-size:12px}
	.files-app,.settings-app{height:calc(100% - 48px);display:grid;grid-template-columns:190px 1fr}.files-app aside,.settings-app aside{background:#f8f9fa;padding:20px;display:flex;flex-direction:column;gap:12px}.dark .files-app aside,.dark .settings-app aside{background:#292a2d}.files-app aside span,.settings-app aside span{padding:8px;border-radius:8px;font-size:13px}.files-app aside span:hover,.settings-app aside span:hover{background:#e8eaed}.files-app section,.settings-app section{padding:28px}.file-grid{display:grid;grid-template-columns:repeat(4,110px);gap:25px}.file-grid div{display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px;border-radius:10px;font-size:35px}.file-grid div:hover{background:#f1f3f4}.file-grid small{font-size:12px}.settings-app label{display:flex;justify-content:space-between;padding:18px;border-bottom:1px solid #eee}.terminal{height:calc(100% - 48px);background:#111;color:#ddd;padding:24px;font:14px/2 ui-monospace,monospace}.prompt{color:#8ab4f8}.prompt span{color:#a5d6a7}.about{text-align:center;padding:70px 30px}.big-logo{font-size:80px;color:#1a73e8}.about h1{font-size:30px}.about p{color:#6b7280}.version{font-size:12px;color:#9aa0a6}
	.launcher,.quick-panel,.notifications{position:absolute;z-index:100;bottom:88px;background:rgba(248,249,250,.96);backdrop-filter:blur(28px);box-shadow:0 12px 45px #0005;border:1px solid #fff;border-radius:22px;color:#202124}.dark .launcher,.dark .quick-panel,.dark .notifications{background:rgba(41,42,45,.97);border-color:#ffffff12;color:#e8eaed}.launcher{left:50%;transform:translateX(-50%);width:min(680px,calc(100vw - 40px));padding:18px}.launcher-search{height:48px;border-radius:24px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 18px;box-shadow:0 1px 5px #0002}.dark .launcher-search{background:#3c4043}.launcher-search input{border:0;outline:0;background:transparent;flex:1;font-size:15px;color:inherit}.app-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:18px}.app{border:0;background:transparent;color:inherit;border-radius:14px;padding:14px 5px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;font-size:12px}.app:hover{background:#0000000c}.app-icon{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:24px;box-shadow:0 2px 6px #0002}.launcher-footer{border-top:1px solid #ddd;margin-top:12px;padding:12px 4px 0;display:flex;justify-content:space-between;color:#5f6368;font-size:12px}.quick-panel{right:18px;width:340px;padding:18px}.quick-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.quick-header small{display:block;color:#777;margin-top:4px}.quick-header button{border:0;background:transparent;font-size:20px}.toggles{display:grid;grid-template-columns:1fr 1fr;gap:8px}.toggles button{border:0;border-radius:14px;background:#e8eaed;padding:14px;display:flex;gap:10px;text-align:left;align-items:center;cursor:pointer}.dark .toggles button{background:#3c4043;color:#e8eaed}.toggles button.on{background:#d2e3fc;color:#174ea6}.toggles small{display:block;font-size:11px;margin-top:3px;color:#5f6368}.slider{display:flex;gap:10px;align-items:center;margin:17px 2px}.slider input{flex:1}.quick-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.quick-actions button{border:0;background:#e8eaed;border-radius:12px;padding:10px 5px;font-size:11px;cursor:pointer}.dark .quick-actions button{background:#3c4043;color:#eee}.notifications{right:18px;width:310px;padding:18px}.empty{margin-top:16px;background:#fff8;padding:30px;text-align:center;border-radius:15px;color:#777}.dark .empty{background:#ffffff08}.empty small{display:block;margin-top:7px}
	@media(max-width:650px){.desktop-hint{display:none}.window{width:calc(100vw - 24px);height:calc(100vh - 105px);top:45%;}.app-grid{grid-template-columns:repeat(4,1fr)}.status-area>button:first-child{display:none}.status b{display:none}.quick-panel{right:10px;left:10px;width:auto}.launcher{width:calc(100vw - 20px);bottom:82px}.shelf{left:6px;right:6px}.pinned button:nth-child(n+4){display:none}}
</style>
