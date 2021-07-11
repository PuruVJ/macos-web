import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { WallpaperID } from '__/data/wallpapers/wallpapers.config';

export const wallpaperImageStore = atom('24-3');

export const wallpaperNameStore = atomWithStorage<WallpaperID>('wallpaper:name', 'catalina');
