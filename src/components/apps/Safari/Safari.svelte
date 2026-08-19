<script lang="ts">
	let url = $state('https://www.google.com/search?igu=1');
	let inputUrl = $state('google.com');
	let frame = $state<HTMLIFrameElement>();
	let embedded = $state(true);
	let externalNotice = $state(false);

	function normalize(value: string) {
		const raw = value.trim();
		if (!raw) return 'https://www.google.com/search?igu=1';
		if (/^https?:\/\//i.test(raw)) return raw;
		if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) return `https://${raw}`;
		return `https://www.google.com/search?igu=1&q=${encodeURIComponent(raw)}`;
	}

	function isGoogle(target: string) {
		try {
			const host = new URL(target).hostname.toLowerCase();
			return host === 'google.com' || host.endsWith('.google.com');
		} catch {
			return false;
		}
	}

	function navigate(value = inputUrl) {
		const target = normalize(value);
		inputUrl = isGoogle(target) ? new URL(target).searchParams.get('q') || 'google.com' : target;
		url = target;

		if (isGoogle(target)) {
			externalNotice = true;
			window.open(target, '_blank', 'noopener,noreferrer');
			return;
		}

		externalNotice = false;
		embedded = true;
		if (frame) frame.src = target;
	}

	function reload() {
		if (frame && embedded) frame.src = url;
	}

	function openExternal() {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<div class="safari-container">
	<header class="toolbar app-window-drag-handle">
		<div class="toolbar-actions">
			<button class="round" aria-label="Voltar" title="Voltar" onclick={() => window.history.back()}>‹</button>
			<button class="round" aria-label="Avançar" title="Avançar" onclick={() => window.history.forward()}>›</button>
			<button class="round" aria-label="Recarregar" title="Recarregar" onclick={reload}>↻</button>
		</div>
		<form class="address-wrap" onsubmit={(e) => { e.preventDefault(); navigate(); }}>
			<div class="address-glass">
				<span class="lock">⌕</span>
				<input bind:value={inputUrl} aria-label="Endereço ou busca" placeholder="Pesquisar ou digitar endereço" />
				<button type="submit" class="go">Ir</button>
			</div>
		</form>
		<button class="share round" aria-label="Abrir fora do Safari" title="Abrir no navegador" onclick={openExternal}>↗</button>
	</header>

	<div class="content">
		{#if embedded}
			<iframe bind:this={frame} src={url} title="Safari Web View" allow="clipboard-read; clipboard-write" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
		{:else}
			<div class="external-page">
				<div class="external-card">
					<div class="google-mark">G</div>
					<h2>Google abriu em uma nova aba</h2>
					<p>O Google impede que a página de pesquisa seja incorporada em uma janela iframe de outro site.</p>
					<button onclick={() => window.open(url, '_blank', 'noopener,noreferrer')}>Abrir Google novamente</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.safari-container { display:flex; flex-direction:column; width:100%; height:100%; overflow:hidden; background:color-mix(in srgb,var(--system-color-light) 94%,transparent); color:var(--system-color-light-contrast); }
	.toolbar { display:flex; align-items:center; gap:.6rem; padding:.55rem .7rem; min-height:3.15rem; background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.16)); border-bottom:1px solid rgba(255,255,255,.42); backdrop-filter:blur(22px) saturate(150%); -webkit-backdrop-filter:blur(22px) saturate(150%); }
	.toolbar-actions { display:flex; gap:.25rem; }
	.round { width:2rem; height:2rem; border:1px solid rgba(255,255,255,.42); background:rgba(255,255,255,.22); color:inherit; border-radius:999px; display:grid; place-items:center; font-size:1rem; box-shadow:inset 0 1px 0 rgba(255,255,255,.35); }
	.round:hover { background:rgba(255,255,255,.38); }
	.address-wrap { flex:1; }
	.address-glass { display:flex; align-items:center; gap:.45rem; min-height:2rem; padding:0 .35rem 0 .75rem; border:1px solid rgba(255,255,255,.48); border-radius:999px; background:rgba(255,255,255,.34); box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 2px 12px rgba(0,0,0,.07); }
	.address-glass input { flex:1; min-width:0; background:transparent; border:0; outline:0; color:inherit; text-align:center; font:inherit; font-size:.9rem; }
	.address-glass input:focus { text-align:left; }
	.lock { opacity:.55; }
	.go { border:0; border-radius:999px; padding:.3rem .65rem; background:rgba(10,132,255,.9); color:white; font-size:.76rem; }
	.content { position:relative; flex:1; min-height:0; background:#fff; }
	iframe { width:100%; height:100%; border:0; background:#fff; }
	.external-page { width:100%; height:100%; display:grid; place-items:center; padding:2rem; background:radial-gradient(circle at top,rgba(10,132,255,.12),transparent 45%),linear-gradient(180deg,#f7f9fc,#eef2f7); }
	.external-card { width:min(31rem,92%); padding:2rem; text-align:center; border-radius:1.6rem; background:rgba(255,255,255,.56); border:1px solid rgba(255,255,255,.65); box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 24px 60px rgba(0,0,0,.1); backdrop-filter:blur(24px); }
	.google-mark { width:4rem; height:4rem; margin:0 auto 1rem; display:grid; place-items:center; border-radius:1.1rem; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,.1); font-size:2.3rem; font-weight:700; }
	.external-card h2 { margin:.2rem 0 .6rem; }
	.external-card p { margin:0 0 1.2rem; opacity:.66; line-height:1.5; font-size:.88rem; }
	.external-card button { border:0; border-radius:999px; padding:.65rem 1rem; background:#0a84ff; color:#fff; font-weight:600; }
	@media(max-width:700px){ .toolbar-actions .round:nth-child(2){display:none}.toolbar{gap:.35rem}.round{width:1.8rem;height:1.8rem} }
</style>
