<script lang="ts">
	import Dock from '../Dock/Dock.svelte';
	import TopBar from '../TopBar/TopBar.svelte';
	import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
	import BootupScreen from './BootupScreen.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import SystemUpdate from './SystemUpdate.svelte';
	import WindowsArea from './Window/WindowsArea.svelte';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	if (!isMac) {
		Promise.all([
			import('@fontsource/inter/latin-ext-300.css'),
			import('@fontsource/inter/latin-ext-400.css'),
			import('@fontsource/inter/latin-ext-500.css'),
			import('@fontsource/inter/latin-ext-600.css'),
		]);
	}
	/** @type {HTMLElement} */
	let mainEl;
</script>

<div bind:this={mainEl} class="container">
	<main>
		<TopBar />
		<WindowsArea />
		<Dock />
	</main>

	<Wallpaper />
	<BootupScreen />
	<SystemUpdate />

	<ContextMenu target_element={mainEl} />

	<div
		class="display-brightness"
		style:opacity="{(100 - preferences.brightness) / 200}"
		aria-hidden="true"
	></div>
</div>

<style>
	.container {
		height: 100%;
		width: 100%;

		position: relative;
	}

	main {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr auto;
	}

	.display-brightness {
		position: fixed;
		inset: 0;

		background: #000;

		pointer-events: none;

		z-index: 999999;

		transition: opacity 150ms ease-out;
	}
</style>