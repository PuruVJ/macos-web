import { writable } from 'svelte-local-storage-store';
import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config';

type WallpaperSettings = {
  id: WallpaperID;
  image: string;
  canControlTheme: boolean;
};

export const wallpaper = writable<WallpaperSettings>('macos:wallpaper-settings:v2', {
  image: 'ventura-2',
  id: 'ventura',
  canControlTheme: true,
});
