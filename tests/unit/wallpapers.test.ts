import { describe, expect, it } from 'vitest';
import { resolveWallpaperFrame, type WallpaperDefinition } from '@/config/wallpapers';

describe('resolveWallpaperFrame', () => {
  it('selects the current frame and theme for dynamic wallpapers', () => {
    const wallpaper: WallpaperDefinition = {
      name: 'Test Dynamic',
      type: 'dynamic',
      thumbnail: 'thumb',
      image: 'default-frame',
      timestamps: {
        wallpaper: {
          7: 'morning-frame',
          19: 'night-frame',
        },
        theme: {
          7: 'light',
          19: 'dark',
        },
      },
    };

    expect(resolveWallpaperFrame(wallpaper, 9)).toEqual({
      image: 'morning-frame',
      theme: 'light',
    });
    expect(resolveWallpaperFrame(wallpaper, 21)).toEqual({
      image: 'night-frame',
      theme: 'dark',
    });
  });

  it('falls back to the base image for standalone wallpapers', () => {
    const wallpaper: WallpaperDefinition = {
      name: 'Standalone',
      type: 'standalone',
      thumbnail: 'thumb',
      image: 'still-frame',
    };

    expect(resolveWallpaperFrame(wallpaper, 12)).toEqual({
      image: 'still-frame',
      theme: undefined,
    });
  });
});
