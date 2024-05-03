import { onDestroy } from 'svelte';

/**
 * Behaves the same as `$effect.root`, but automatically
 * cleans up the effect inside Svelte components.
 *
 * @returns Cleanup function to manually cleanup the effect.
 */
function auto_destroy_effect_root(fn: () => void | VoidFunction) {
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
    // cleaning up builders created outside Svelte components.
  }

  return destroy;
}

export function persisted<T>(key: string, initial: T) {
  const existing = localStorage.getItem(key);

  let state = $state<T>(existing ? JSON.parse(existing) : initial);

  auto_destroy_effect_root(() => {
    $effect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    });
  });

  return {
    get value() {
      return state;
    },

    set value(new_state) {
      state = new_state;
    },

    reset() {
      state = initial;
    },
  };
}
