<script lang="ts">
	import { elevation } from '🍎/attachments';
	import Dock from '../Dock/Dock.svelte';
	import TopBar from '../TopBar/TopBar.svelte';
	import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
	import BootupScreen from './BootupScreen.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import SystemUpdate from './SystemUpdate.svelte';
	import WindowsArea from './Window/WindowsArea.svelte';
	import { brightness } from '🍎/state/preferences.svelte';

	const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	if (!isMac) {
		Promise.all([
			import('@fontsource/inter/latin-ext-300.css'),
			import('@fontsource/inter/latin-ext-400.css'),
			import('@fontsource/inter/latin-ext-500.css'),
			import('@fontsource/inter/latin-ext-600.css'),
		]);
	}

	let main_el: HTMLElement;
</script>

<div
	class="brightness-overlay"
	{@attach elevation('brightness-overlay')}
	style:opacity={1 - brightness.current / 100}
></div>

<div bind:this={main_el} class="container">
	<main>
		<TopBar />
		<WindowsArea />

		<Dock />
	</main>

	<Wallpaper />
	<BootupScreen />
	<SystemUpdate />

	<ContextMenu target_element={main_el} />
</div>

<style>
	.brightness-overlay {
		position: fixed;
		inset: 0;

		height: 100%;
		width: 100%;

		background-color: black;

		transition: opacity 100ms ease;

		pointer-events: none;
	}

	.container {
		height: 100%;
		width: 100%;
	}

	main {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
