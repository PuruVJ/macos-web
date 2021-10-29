import { writable } from 'svelte-local-storage-store';
import type { WallpaperID } from '__/configs/wallpapers/wallpaper.config';

export const wallpaperImage = writable('macos:wallpaper-image', '37-2');
export const wallpaperName = writable<WallpaperID>('macos:wallpaper-name', 'monterey');
