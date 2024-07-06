<script lang="ts">
	import { onMount } from 'svelte';
	import { sleep } from '🍎/helpers/sleep';
	import type { AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { spring } from '🍎/state/spring.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();

	const motion_val = spring(0, { damping: 0.28, stiffness: 0.1 });

	onMount(async () => {
		await sleep(100);

		motion_val.value = 1;
	});

	const image_transform = $derived(
		!preferences.reduced_motion
			? `rotate(${180 * (motion_val.value + 1)}deg) scale(${motion_val.value}) translateZ(0px)`
			: 'initial',
	);
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle"></header>
	<section class="main-area">
		<img
			style:transform={image_transform}
			src="/app-icons/{app_id}/256.webp"
			alt="Placeholder App"
		/>

		<br />

		<h1 style:display="flex" style:align-items="center" style:gap="0.5rem">
			Nothing here yet <img
				style="height: 1em; width: auto; transform: translateY(0.1em);"
				src="/emojis/wink.png"
				alt="Wink Emoji"
			/>
		</h1>
	</section>
</section>

<style>
	.container {
		background-color: var(--system-color-light);

		border-radius: inherit;
	}

	.titlebar {
		padding: 1rem 1rem;

		width: 100%;

		position: absolute;
		top: 0;
		left: 0;
	}

	.main-area {
		font-size: 1.618rem;
		color: var(--system-color-light-contrast);

		height: 100%;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	img {
		max-width: 8rem;
		aspect-ratio: 1 / 1;
	}
</style>
