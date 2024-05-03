import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';

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
