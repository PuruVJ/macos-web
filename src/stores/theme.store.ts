import { persisted } from 'svelte-local-storage-store';
import { colors } from '🍎/configs/theme/colors.config';

export type Theme = {
  scheme: 'light' | 'dark';
  primaryColor: keyof typeof colors;
};

export const theme = persisted<Theme>('macos:theme-settings', {
  scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  primaryColor: 'blue',
});

theme.subscribe(({ scheme, primaryColor }) => {
  // Color scheme
  const { classList } = document.body;
  classList.remove('light', 'dark');
  classList.add(scheme);

  // Primary color
  const colorObj = colors[primaryColor][scheme];

  const setStyle = (name: string, value: string) => document.body.style.setProperty(name, value);

  setStyle('--system-color-primary', `hsl(${colorObj.hsl})`);
  setStyle('--system-color-primary-hsl', `${colorObj.hsl}`);
  setStyle('--system-color-primary-contrast', `hsl(${colorObj.contrastHsl})`);
  setStyle('--system-color-primary-contrast-hsl', `${colorObj.contrastHsl}`);
});
