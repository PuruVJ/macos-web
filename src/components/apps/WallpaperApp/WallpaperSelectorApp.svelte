<script lang="ts">
	import { wallpapers_config, type WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const dynamic_wallpapers = Object.entries(wallpapers_config).filter(
		([, { type }]) => type === 'dynamic',
	);

	const standalone_wallpapers = Object.entries(wallpapers_config).filter(
		([, { type }]) => type === 'standalone',
	);

	const current_wallpaper_thumb = $derived(`url(${preferences.wallpaper.image})`);

	function change_wallpaper(wallpaperName: WallpaperID) {
		preferences.wallpaper.id = wallpaperName;
	}

	function preload(url: string) {
		const link = document.createElement('link');
		link.rel = 'prefetch';

		link.href = url;
		link.as = 'image';

		document.head.appendChild(link);
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>Wallpapers</span>
	</header>

	<section class="main-area">
		<section class="selected-wallpaper-section">
			<div class="image" style:background-image={current_wallpaper_thumb}></div>

			<div class="info">
				<h2>{wallpapers_config[preferences.wallpaper.id].name}</h2>
				<p class="wallpaper-type">
					{wallpapers_config[preferences.wallpaper.id].type} wallpaper
				</p>

				<br /> <br />

				{#if wallpapers_config[preferences.wallpaper.id].type !== 'standalone'}
					<label>
						<input type="checkbox" bind:checked={preferences.wallpaper.canControlTheme} />
						Change dark/light mode as wallpapers change
					</label>
				{/if}
			</div>
		</section>

		<br /><br /><br /><br />

		<section class="dynamic-wallpapers">
			<h2>Dynamic Wallpapers</h2>

			<div class="wallpapers">
				{#each dynamic_wallpapers as [id, { thumbnail, name, image }]}
					<div class="wallpaper-button">
						<button onclick={() => change_wallpaper(id)} onpointerenter={() => preload(image)}>
							<img src={thumbnail} alt="MacOS {name} Wallpapers, dynamic" />
						</button>
						<p>{name}</p>
					</div>
				{/each}
			</div>
		</section>

		<br /><br /><br />

		<section class="standalone-wallpapers">
			<h2>Standalone Wallpapers</h2>

			<div class="wallpapers">
				{#each standalone_wallpapers as [id, { thumbnail, name, image }]}
					<div class="wallpaper-button">
						<button onclick={() => change_wallpaper(id)} onpointerenter={() => preload(image)}>
							<img src={thumbnail} alt="MacOS {name} Wallpapers, dynamic" />
						</button>
						<p>{name}</p>
					</div>
				{/each}
			</div>
		</section>
	</section>
</section>

<style>
	h2 {
		line-height: 1.618;
		font-size: 1.618rem;

		margin: 0 0 1rem 0;
	}

	.container {
		background-color: var(--system-color-light);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto 1fr;

		min-height: auto;
		height: 100% !important;
		max-height: 100%;

		overflow-y: hidden;
	}

	.titlebar {
		display: flex;
		justify-content: center;

		padding: 0.9rem 1rem;

		width: 100%;

		border-bottom: solid 0.9px hsla(var(--system-color-dark-hsl), 0.3);

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	.main-area {
		font-size: 1rem;
		color: var(--system-color-light-contrast);

		height: 100%;
		width: 100%;

		overflow-y: auto;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;

		&::-webkit-scrollbar {
			background-color: transparent;
			width: 18px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: hsla(var(--system-color-dark-hsl), 0.8);
			border: 6px solid transparent;
			border-radius: 16px;
			background-clip: content-box;
			transition: all 200ms;
		}

		&::-webkit-scrollbar-thumb:hover {
			background-color: hsla(var(--system-color-dark-hsl), 1);
		}
	}

	.selected-wallpaper-section {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;

		.image {
			width: 30rem;
			height: auto;

			border-radius: 1rem;

			aspect-ratio: 16 / 10;

			will-change: background-image;

			transition: background-image 150ms ease-in;

			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
		}

		.info {
			display: flex;
			flex-direction: column;
		}

		h2 {
			margin-bottom: 0;
		}

		.wallpaper-type {
			color: hsla(var(--system-color-dark-hsl), 0.7);
			text-transform: capitalize;
		}

		label {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			input {
				margin-left: 0;

				height: 1.2rem;
				width: 1.2rem;

				accent-color: var(--system-color-primary);
			}
		}
	}

	.dynamic-wallpapers,
	.standalone-wallpapers {
		.wallpapers {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
			gap: 1rem;
		}
	}

	.dynamic-wallpapers .wallpaper-button button {
		aspect-ratio: 1 / 1;
	}

	.standalone-wallpapers .wallpapers {
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)) !important;
	}

	.wallpaper-button {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		border-radius: 0.75rem;

		button {
			width: 100%;
			height: auto;
			aspect-ratio: 16 / 10;

			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			border-radius: 0.75rem;

			&:hover,
			&:focus-visible {
				img {
					box-shadow: 0 0 0 0.25rem hsla(var(--system-color-primary-hsl), 0.7);
				}
			}
		}

		img {
			width: 100%;
			height: 100%;

			object-fit: cover;

			border-radius: inherit;

			transition: box-shadow 100ms ease-in;
		}

		p {
			width: 100%;
			text-align: center;
		}
	}
</style>
