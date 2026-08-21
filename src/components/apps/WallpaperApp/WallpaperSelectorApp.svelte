<script lang="ts">
	import { wallpapers_config, type WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
	import '🍎/configs/wallpapers/legacy-macos-wallpapers.ts';
	import { legacy_macos_wallpapers } from '🍎/configs/wallpapers/legacy-macos-wallpapers.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const dynamic_wallpapers = Object.entries(wallpapers_config).filter(([, { type }]) => type === 'dynamic');
	const legacy_wallpapers = Object.entries(legacy_macos_wallpapers);
	const standalone_wallpapers = Object.entries(wallpapers_config).filter(([id, { type }]) => type === 'standalone' && !(id in legacy_macos_wallpapers));
	const current_wallpaper_thumb = $derived(`url(${preferences.wallpaper.image})`);

	function change_wallpaper(wallpaperName: WallpaperID | keyof typeof legacy_macos_wallpapers) {
		const selected = wallpapers_config[wallpaperName as WallpaperID] ?? legacy_macos_wallpapers[wallpaperName as keyof typeof legacy_macos_wallpapers];
		if (!selected) return;
		preferences.wallpaper.id = wallpaperName as WallpaperID;
		if (selected.image) preferences.wallpaper.image = selected.image;
	}

	function preload(url?: string) {
		if (!url) return;
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = url;
		link.as = 'image';
		document.head.appendChild(link);
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle"><span>Wallpapers</span></header>
	<section class="main-area">
		<section class="selected-wallpaper-section">
			<div class="image" style:background-image={current_wallpaper_thumb}></div>
			<div class="info">
				<h2>{wallpapers_config[preferences.wallpaper.id]?.name ?? legacy_macos_wallpapers[preferences.wallpaper.id as keyof typeof legacy_macos_wallpapers]?.name ?? 'Wallpaper'}</h2>
				<p class="wallpaper-type">{wallpapers_config[preferences.wallpaper.id]?.type ?? 'standalone'} wallpaper</p>
			</div>
		</section>

		<section class="dynamic-wallpapers">
			<h2>Dynamic Wallpapers</h2>
			<div class="wallpapers">
				{#each dynamic_wallpapers as [id, { thumbnail, name, image }]}
					<div class="wallpaper-button">
						<button onclick={() => change_wallpaper(id as WallpaperID)} onpointerenter={() => preload(image)}>
							<img src={thumbnail} alt="macOS {name} dynamic wallpaper" />
						</button>
						<p>{name}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="legacy-wallpapers">
			<h2>Classic Mac OS X</h2>
			<div class="wallpapers">
				{#each legacy_wallpapers as [id, wallpaper]}
					<div class="wallpaper-button">
						<button onclick={() => change_wallpaper(id as keyof typeof legacy_macos_wallpapers)} onpointerenter={() => preload(wallpaper.image)}>
							<img src={wallpaper.image} alt={wallpaper.name} loading="lazy" />
						</button>
						<p>{wallpaper.name}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="standalone-wallpapers">
			<h2>Other Wallpapers</h2>
			<div class="wallpapers">
				{#each standalone_wallpapers as [id, { thumbnail, name, image }]}
					<div class="wallpaper-button">
						<button onclick={() => change_wallpaper(id as WallpaperID)} onpointerenter={() => preload(image)}>
							<img src={thumbnail} alt="macOS {name} wallpaper" />
						</button>
						<p>{name}</p>
					</div>
				{/each}
			</div>
		</section>
	</section>
</section>

<style>
	h2{line-height:1.35;font-size:1.35rem;margin:0 0 1rem}
	.container{background-color:var(--system-color-light);border-radius:inherit;display:grid;grid-template-rows:auto 1fr;height:100%!important;max-height:100%;overflow:hidden}
	.titlebar{display:flex;justify-content:center;padding:.9rem 1rem;width:100%;border-bottom:solid .9px hsla(var(--system-color-dark-hsl),.3)}
	.titlebar span{color:hsla(var(--system-color-dark-hsl),.8);font-weight:500;font-size:.9rem;letter-spacing:.5px}
	.main-area{font-size:1rem;color:var(--system-color-light-contrast);height:100%;width:100%;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:1rem;gap:2rem}
	.selected-wallpaper-section{display:grid;grid-template-columns:minmax(0,30rem);gap:1rem;width:min(100%,30rem)}
	.image{width:100%;aspect-ratio:16/10;border-radius:1rem;background-repeat:no-repeat;background-size:cover;background-position:center;box-shadow:0 12px 30px rgba(0,0,0,.16);transition:background-image 180ms ease}
	.info{display:flex;flex-direction:column;gap:.35rem}.info h2{margin:0}.wallpaper-type{margin:0;color:hsla(var(--system-color-dark-hsl),.7);text-transform:capitalize}
	.dynamic-wallpapers,.legacy-wallpapers,.standalone-wallpapers{width:min(100%,54rem)}
	.wallpapers{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:1rem}
	.standalone-wallpapers .wallpapers,.legacy-wallpapers .wallpapers{grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))}
	.wallpaper-button{display:flex;flex-direction:column;gap:.45rem}.wallpaper-button button{width:100%;aspect-ratio:16/10;padding:0;border:0;background:transparent;border-radius:.8rem;overflow:hidden}.wallpaper-button button:hover img,.wallpaper-button button:focus-visible img{box-shadow:0 0 0 .22rem color-mix(in srgb,var(--system-color-primary) 72%,transparent)}
	.wallpaper-button img{width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;transition:box-shadow 100ms ease}.wallpaper-button p{margin:0;text-align:center;font-size:.8rem;opacity:.8}
</style>
