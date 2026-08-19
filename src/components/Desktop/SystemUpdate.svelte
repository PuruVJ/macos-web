<script lang="ts">
	// GitHub Pages build intentionally runs without the PWA service worker.
	// Keep this component inert so it cannot import the PWA virtual module.
	import { system_needs_update } from '🍎/state/system.svelte';

	system_needs_update.value = false;
</script>
