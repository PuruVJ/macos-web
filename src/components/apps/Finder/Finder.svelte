<script lang="ts">
	const folders = [
		{ name: 'Desktop', icon: 'desktop', count: 8 },
		{ name: 'Documents', icon: 'documents', count: 14 },
		{ name: 'Downloads', icon: 'downloads', count: 6 },
		{ name: 'Applications', icon: 'applications', count: 24 },
	];

	let selected = $state('Desktop');
	let query = $state('');

	const filteredFolders = $derived(
		folders.filter((folder) => folder.name.toLowerCase().includes(query.toLowerCase())),
	);
</script>

<section class="finder-shell">
	<header class="toolbar app-window-drag-handle">
		<div class="traffic-space" aria-hidden="true"></div>
		<strong>Finder</strong>
		<div class="controls">
			<button aria-label="Back" disabled>‹</button>
			<button aria-label="Forward" disabled>›</button>
			<input bind:value={query} aria-label="Search Finder" placeholder="Search" />
		</div>
	</header>

	<div class="body">
		<aside>
			<h4>Favorites</h4>
			{#each filteredFolders as folder}
				<button class:selected={selected === folder.name} onclick={() => (selected = folder.name)}>
					<span class="folder-icon">⌂</span>
					<span>{folder.name}</span>
					<small>{folder.count}</small>
				</button>
			{/each}
		</aside>

		<main>
			<div class="title-row">
				<h2>{selected}</h2>
				<span>{filteredFolders.find((folder) => folder.name === selected)?.count ?? 0} items</span>
			</div>

			<div class="grid">
				{#each Array(filteredFolders.find((folder) => folder.name === selected)?.count ?? 0) as _, index}
					<button class="item" aria-label={`File ${index + 1}`}>
						<div class="file-icon">{index % 3 === 0 ? '▣' : '▤'}</div>
						<span>{selected} Item {index + 1}</span>
					</button>
				{/each}
			</div>
		</main>
	</div>
</section>

<style>
	.finder-shell { height: 100%; width: 100%; display: grid; grid-template-rows: 3rem 1fr; overflow: hidden; color: var(--system-color-dark); background: color-mix(in srgb, var(--system-color-light) 92%, transparent); }
	.toolbar { position: relative; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--system-divider); background: color-mix(in srgb, var(--system-surface-background) 92%, transparent); backdrop-filter: blur(20px) saturate(120%); }
	.toolbar strong { font-size:.8rem; }
	.traffic-space { position:absolute; inset:0; }
	.controls { position:absolute; left:.8rem; right:.8rem; display:flex; align-items:center; gap:.35rem; }
	.controls button { width:1.65rem; height:1.65rem; border-radius:.5rem; background:color-mix(in srgb, var(--system-color-dark) 8%, transparent); }
	.controls input { margin-left:auto; width:11rem; padding:.35rem .65rem; border:1px solid var(--system-surface-border); border-radius:.55rem; background:color-mix(in srgb, var(--system-color-light) 65%, transparent); color:inherit; outline:0; }
	.body { min-height:0; display:grid; grid-template-columns: 13rem 1fr; }
	aside { padding:1rem .7rem; border-right:1px solid var(--system-divider); background:color-mix(in srgb, var(--system-color-light) 60%, transparent); backdrop-filter:blur(16px); }
	h4 { margin:.2rem .5rem .6rem; font-size:.7rem; opacity:.55; text-transform:uppercase; letter-spacing:.08em; }
	aside button { width:100%; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:.55rem; padding:.45rem .55rem; border-radius:.55rem; text-align:left; color:inherit; }
	aside button.selected { background:color-mix(in srgb, var(--system-color-primary) 12%, transparent); }
	.folder-icon { font-size:.9rem; opacity:.8; }
	aside small { opacity:.45; }
	main { min-width:0; min-height:0; overflow:auto; padding:1.1rem 1.2rem 4rem; }
	.title-row { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:1rem; }
	h2 { margin:0; font-size:1.25rem; }
	.title-row span { opacity:.55; font-size:.75rem; }
	.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(7rem,1fr)); gap:1rem; }
	.item { min-height:7rem; padding:.8rem .5rem; border-radius:.75rem; display:flex; flex-direction:column; align-items:center; gap:.55rem; color:inherit; background:transparent; }
	.item:hover { background:color-mix(in srgb, var(--system-color-dark) 7%, transparent); }
	.item span { font-size:.72rem; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%; }
	.file-icon { width:3rem; height:3rem; display:grid; place-items:center; border-radius:.75rem; background:linear-gradient(180deg, #f6f6f6, #cfd4dc); color:#6b7280; box-shadow:0 4px 10px rgba(0,0,0,.15); }
</style>
