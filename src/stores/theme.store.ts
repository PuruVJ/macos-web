import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

export const theme = writable<Theme>(
  matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

theme.subscribe((val) => {
  // Set initial value based on device theme or localstorage preference
  let localVal = localStorage.getItem<Theme>('theme:type');

  if (localVal) {
    theme.set(localVal);
    val = localVal;
  }

  const { classList } = document.body;
  classList.remove('light', 'dark');
  classList.add(val);

  localStorage.setItem('theme:type', val);
});
