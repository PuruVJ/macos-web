import type { Theme } from '__/stores/theme.store';

export type Wallpaper = {
  name: string;
  type: 'standalone' | 'automatic' | 'dynamic';

  /** Timestamps definition in terms of when a new wallpaper should take effect */
  timestamps?: {
    wallpaper?: Record<number, string>;
    theme?: Record<number, Theme>;
  };
};

const createWallpapersConfig = <TConfig>(et: Record<keyof TConfig, Wallpaper>) => et;

export const wallpapersConfig = createWallpapersConfig({
  'big-sur-graphic': {
    name: 'Big Sur Graphic',
    type: 'automatic',
    timestamps: {
      wallpaper: {
        7: '3-2',
        18: '3-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  monterey: {
    name: 'Monterey',
    type: 'automatic',
    timestamps: {
      wallpaper: {
        7: '37-2',
        18: '37-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  catalina: {
    name: 'Catalina',
    type: 'dynamic',
    timestamps: {
      wallpaper: {
        7: '24-2',
        9: '24-3',
        11: '24-4',
        13: '24-5',
        15: '24-6',
        16: '24-7',
        17: '24-8',
        18: '24-1',
      },
      theme: {
        9: 'light',
        17: 'dark',
      },
    },
  },
});

export type WallpaperID = keyof typeof wallpapersConfig;
