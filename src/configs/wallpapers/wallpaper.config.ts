import type { Theme } from '🍎/stores/theme.store';

export type Wallpaper = {
  name: string;
  type: 'standalone' | 'automatic' | 'dynamic';

  thumbnail: string;

  /** Timestamps definition in terms of when a new wallpaper should take effect */
  timestamps?: {
    wallpaper?: Record<number, string>;
    theme?: Record<number, Theme['scheme']>;
  };
};

const createWallpapersConfig = <TConfig>(et: Record<keyof TConfig, Wallpaper>) => et;

export const wallpapersConfig = createWallpapersConfig({
  monterey: {
    name: 'Monterey',
    type: 'dynamic',
    thumbnail: '37-2',
    timestamps: {
      wallpaper: {
        7: '37-2',
        9: '37-3',
        11: '37-4',
        13: '37-5',
        15: '37-6',
        16: '37-7',
        17: '37-8',
        18: '37-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  'big-sur-graphic': {
    name: 'Big Sur Graphic',
    type: 'dynamic',
    thumbnail: '3-2',
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

  'big-sur': {
    name: 'Monterey',
    type: 'dynamic',
    thumbnail: '12-4',
    timestamps: {
      wallpaper: {
        7: '12-2',
        9: '12-3',
        11: '12-4',
        13: '12-5',
        15: '12-6',
        16: '12-7',
        17: '12-8',
        18: '12-1',
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
    thumbnail: '24-3',
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

  'kryptonian-demise': {
    name: 'Kryptonian Demise',
    type: 'standalone',
    thumbnail: '38',
  },

  'nahargarh-sunset': {
    name: 'Nahargarh Sunset',
    type: 'standalone',
    thumbnail: '39',
  },

  'somber-forest': {
    name: 'Somber Forest',
    type: 'standalone',
    thumbnail: '40',
  },

  'blade-runner-2149': {
    name: 'Blade Runner 2149',
    type: 'standalone',
    thumbnail: '41',
  },

  'lone-dune-wolf': {
    name: 'Lone Dune Wolf',
    type: 'standalone',
    thumbnail: '42',
  },

  'childhood-innocence': {
    name: 'Childhood Innocence',
    type: 'standalone',
    thumbnail: '43',
  },

  'fox-in-somber-forest': {
    name: 'Fox in Somber Forest',
    type: 'standalone',
    thumbnail: '44',
  },

  'blood-diamond': {
    name: 'Blood Diamond',
    type: 'standalone',
    thumbnail: '45',
  },

  'black-bird-in-a-city': {
    name: 'Black Bird in a City',
    type: 'standalone',
    thumbnail: '46',
  },

  'sunrise-of-dreams': {
    name: 'Sunrise of Dreams',
    type: 'standalone',
    thumbnail: '47',
  },

  'how-do-we-get-down': {
    name: 'How do we get down?',
    type: 'standalone',
    thumbnail: '48',
  },

  'cozy-night-with-cat': {
    name: 'Cozy Night with Cat',
    type: 'standalone',
    thumbnail: '49',
  },

  'age-of-titans': {
    name: 'Age of Titans',
    type: 'standalone',
    thumbnail: '50',
  },

  dune: {
    name: 'Dune',
    type: 'standalone',
    thumbnail: '51',
  },

  'vibrant-night': {
    name: 'Vibrant Night',
    type: 'standalone',
    thumbnail: '52',
  },

  'cabin-in-woods': {
    name: 'Cabin in the Woods',
    type: 'standalone',
    thumbnail: '53',
  },

  'asgardian-sunrise': {
    name: 'Asgardian Sunrise',
    type: 'standalone',
    thumbnail: '54',
  },

  'asura-lok': {
    name: 'Asura Lok',
    type: 'standalone',
    thumbnail: '55',
  },

  'my-neighbour-totoro': {
    name: 'My Neighbour Totoro',
    type: 'standalone',
    thumbnail: '56',
  },

  tron: {
    name: 'Tron',
    type: 'standalone',
    thumbnail: '57',
  },
});

export type WallpaperID = keyof typeof wallpapersConfig;
