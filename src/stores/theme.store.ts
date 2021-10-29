import { writable } from 'svelte-local-storage-store';

export type Theme = 'light' | 'dark';

export const theme = writable<Theme>(
  'macos:theme',
  matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
);

theme.subscribe((val) => {
  const { classList } = document.body;
  classList.remove('light', 'dark');
  classList.add(val);
});
