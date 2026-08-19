<script lang="ts">
	const storageKey = 'macos-web-notes';
	let note = $state(localStorage.getItem(storageKey) ?? 'Welcome to your Mac.\n\nThis note is saved automatically in your browser.');
	let saved = $state(true);

	function update(value: string) {
		note = value;
		saved = false;
		localStorage.setItem(storageKey, value);
		saved = true;
	}

	function clear() { update(''); }
</script>

<section class="container">
	<header class="toolbar app-window-drag-handle">
		<div class="traffic-space"></div>
		<div class="title">Notes</div>
		<span class="status">{saved ? 'Saved' : 'Saving…'}</span>
	</header>
	<div class="paper">
		<div class="note-header">
			<h1>Notes</h1>
			<button onclick={clear} aria-label="Clear note">Clear</button>
		</div>
		<textarea value={note} oninput={(e) => update(e.currentTarget.value)} spellcheck="true" aria-label="Note"></textarea>
	</div>
</section>

<style>
	.container { height: 100%; width: 100%; display: grid; grid-template-rows: 2.8rem 1fr; overflow: hidden; border-radius: inherit; background: #f7f7f5; color: #222; }
	.toolbar { position: relative; display:flex; align-items:center; justify-content:center; border-bottom:1px solid rgba(0,0,0,.1); background:rgba(245,245,245,.88); backdrop-filter:blur(18px); }
	.title { font-size:.8rem; font-weight:600; }
	.status { position:absolute; right:.9rem; color:#888; font-size:.7rem; }
	.traffic-space { position:absolute; inset:0; }
	.paper { max-width:900px; width:100%; margin:auto; height:100%; padding:2rem clamp(1.2rem,5vw,4rem); display:flex; flex-direction:column; }
	.note-header { display:flex; align-items:center; justify-content:space-between; }
	h1 { margin:0 0 1rem; font-size:2rem; }
	button { padding:.35rem .7rem; border-radius:.5rem; background:#e6e6e6; cursor:pointer; }
	textarea { flex:1; width:100%; resize:none; border:0; outline:0; background:transparent; font:1rem/1.65 var(--system-font-family); color:inherit; }
</style>
