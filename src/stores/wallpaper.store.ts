import { writable } from 'svelte-local-storage-store';
import type { WallpaperID } from '__/configs/wallpapers/wallpaper.config';

type WallpaperSettings = {
  id: WallpaperID;
  image: string;
  canControlTheme: boolean;
};

export const wallpaper = writable<WallpaperSettings>('macos:wallpaper-settings', {
  image: '37-2',
  id: 'monterey',
  canControlTheme: true,
});
