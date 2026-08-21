<script lang="ts">
	import { untrack } from 'svelte';
	import { elevation } from '🍎/actions';
	import { wallpapers_config } from '🍎/configs/wallpapers/wallpaper.config.ts';
	import { smaller_closest_value } from '🍎/helpers/smaller-closest-value.ts';
	import { create_interval } from '🍎/state/interval.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	let visible_background_image = $state(wallpapers_config.ventura.image ?? '');
	const interval = create_interval(5 * 1000);

	$effect(() => {
		const selectedImage = preferences.wallpaper.image;
		if (selectedImage && selectedImage !== visible_background_image) {
			untrack(() => (visible_background_image = selectedImage));
		}
	});

	$effect(() => {
		interval.value;
		const currentWallpaper = wallpapers_config[preferences.wallpaper.id];
		if (!currentWallpaper) return;

		if (currentWallpaper.type === 'standalone') {
			untrack(() => (preferences.wallpaper.image = currentWallpaper.image ?? ''));
			return;
		}

		untrack(handleTheme);
		untrack(handleWallpaper);
	});

	function handleWallpaper() {
		const currentWallpaper = wallpapers_config[preferences.wallpaper.id];
		const map = currentWallpaper?.timestamps?.wallpaper;
		if (!map) return;

		const hour = new Date().getHours();
		const timestamps = Object.keys(map).map(Number);
		const minTimestamp = Math.min(...timestamps);
		const maxTimestamp = Math.max(...timestamps);

		if (hour > maxTimestamp || hour < minTimestamp) {
			const fallback = map[maxTimestamp];
			if (fallback) preferences.wallpaper.image = fallback;
			return;
		}

		const chosen = smaller_closest_value(timestamps.map(String), hour).toString();
		const image = map[Number(chosen)];
		if (image) preferences.wallpaper.image = image;
	}

	function handleTheme() {
		if (!preferences.wallpaper.canControlTheme) return;
		const currentWallpaper = wallpapers_config[preferences.wallpaper.id];
		const map = currentWallpaper?.timestamps?.theme;
		if (!map) return;

		const hour = new Date().getHours();
		const timestamps = Object.keys(map).map(Number);
		const minTimestamp = Math.min(...timestamps);
		const maxTimestamp = Math.max(...timestamps);

		if (hour > maxTimestamp || hour < minTimestamp) {
			preferences.theme.scheme = map[maxTimestamp] ?? 'dark';
			return;
		}

		const chosen = smaller_closest_value(timestamps.map(String), hour).toString();
		preferences.theme.scheme = map[Number(chosen)] ?? 'light';
	}
</script>

<div
	class="background-cover"
	style:background-image={visible_background_image ? `url("${visible_background_image}")` : 'none'}
	use:elevation={'wallpaper'}
></div>

<style>
	.background-cover {
		height: 100%;
		width: 100%;
		position: fixed;
		inset: 0;
		z-index: 0;
		will-change: background-image;
		transition: background-image 150ms ease-in;
		background-color: #17233a;
		background-image:
			radial-gradient(circle at 20% 15%, rgba(255,255,255,.18), transparent 32%),
			linear-gradient(135deg, #17233a 0%, #315a86 46%, #151d32 100%);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
