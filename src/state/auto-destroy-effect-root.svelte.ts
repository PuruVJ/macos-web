import { onDestroy } from 'svelte';

/**
 * Behaves the same as `$effect.root`, but automatically
 * cleans up the effect inside Svelte components.
 *
 * @returns Cleanup function to manually cleanup the effect.
 */
export function auto_destroy_effect_root(fn: () => void | VoidFunction) {
	let cleanup: VoidFunction | null = $effect.root(fn);

	function destroy() {
		if (cleanup === null) {
			return;
		}

		cleanup();
		cleanup = null;
	}

	try {
		onDestroy(destroy);
	} catch {
		// Ignore the error. The user is responsible for manually
		// cleaning up effects created outside Svelte components.
	}

	return destroy;
}
