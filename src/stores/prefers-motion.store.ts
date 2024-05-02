import { persisted } from 'svelte-local-storage-store';

export const prefersReducedMotion = persisted(
  'macos:is-reduced-motion',
  matchMedia('(prefers-reduced-motion)').matches,
);
