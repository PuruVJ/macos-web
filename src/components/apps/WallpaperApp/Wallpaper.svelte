<script lang="ts">
	import { elevation } from '🍎/attachments';
	import { wallpaper } from '🍎/state/preferences.svelte.ts';

	let visible_background_image = $state(wallpaper.image);

	function preview_image_on_load() {
		visible_background_image = wallpaper.image;
	}
</script>

<!-- This preload and render the image for browser but invisible to user -->
<img src={wallpaper.image} aria-hidden="true" alt="" onload={preview_image_on_load} />

<div
	class="background-cover"
	style:background-image="url({visible_background_image})"
	{@attach elevation('wallpaper')}
></div>

<style>
	img {
		height: 1px;
		width: 1px;

		display: none;
	}

	.background-cover {
		height: 100%;
		width: 100%;

		position: fixed;
		top: 0;
		left: 0;

		will-change: background-image;

		transition: background-image 150ms ease-in;

		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
