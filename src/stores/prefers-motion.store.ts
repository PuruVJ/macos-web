import { persisted } from 'svelte-persisted-store';

export const prefersReducedMotion = persisted(
  'macos:is-reduced-motion',
  matchMedia('(prefers-reduced-motion)').matches,
);
