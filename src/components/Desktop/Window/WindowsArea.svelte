<script lang="ts">
	import { untrack } from 'svelte';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';

	$effect(() => {
		apps.active;

		untrack(() => (apps.active_z_index += 2));
	});

	// Keeps all the app z indices under 50 so they don't go above the UI elements
	$effect(() => {
		if (!Object.values(apps.z_indices).some((z_index) => z_index > 50)) return;

		// Get the lowest non-zero z-index
		const lowest_z_index = Math.min(
			...[...new Set(Object.values(apps.z_indices))].filter((val) => val !== 0),
		);

		untrack(() => (apps.active_z_index -= lowest_z_index));

		const keys = Object.keys(apps.z_indices);

		for (const app of keys) {
			if (apps.z_indices[app] >= lowest_z_index) {
				untrack(() => (apps.z_indices[app] -= lowest_z_index));
			}
		}
	});
</script>

<section id="windows-area">
	{#each Object.keys(apps_config) as app_id}
		{#if apps.open[app_id] && apps_config[app_id].should_open_window}
			{#await import('./Window.svelte') then { default: Window }}
				<Window {app_id} />
			{/await}
		{/if}
	{/each}
</section>

<style>
	section {
		display: block;

		/* // 1.7 rem is the heigh of the header
    // 5.25 rem is the height of dock
    // top: 1.75rem; */
		height: 100%;

		width: 100vw;

		justify-self: center;
	}
</style>
