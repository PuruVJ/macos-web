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

const optimizedWallpapers = import.meta.glob('../../assets/wallpapers/*.{webp,jpg}', {
  eager: true,
  query: { width: 2000, quality: 95, format: 'webp' },
}) as Record<string, NodeModule>;

const createWallpapersConfig = <TConfig = string>(
  wallpaperConfig: Record<keyof TConfig, Wallpaper>,
): Record<keyof TConfig, Wallpaper> => {
  const optimizedWallpapersArr = Object.entries(optimizedWallpapers);

  for (const [wallpaperName, config] of Object.entries(wallpaperConfig)) {
    const wallpaper = wallpaperConfig[wallpaperName as keyof TConfig];

    wallpaper.thumbnail = (
      optimizedWallpapersArr.find(([path]) => path.includes(config.thumbnail))[1] as any
    ).default;

    if (wallpaper.type !== 'standalone') {
      for (const [time, imgName] of Object.entries(config.timestamps.wallpaper)) {
        wallpaper.timestamps.wallpaper[time] = (
          optimizedWallpapersArr.find(([path]) => path.includes(imgName))[1] as any
        ).default;
      }
    }
  }

  return wallpaperConfig;
};

export const wallpapersConfig = createWallpapersConfig({
  ventura: {
    name: 'Ventura',
    type: 'dynamic',

    thumbnail: 'ventura-2',
    timestamps: {
      wallpaper: {
        7: 'ventura-5',
        9: 'ventura-2',
        12: 'ventura-3',
        17: 'ventura-4',
        18: 'ventura-5',
        19: 'ventura-1',
      },
      theme: {
        7: 'light',
        19: 'dark',
      },
    },
  },

  monterey: {
    name: 'Monterey',
    type: 'dynamic',
    thumbnail: 'monterey-2',
    timestamps: {
      wallpaper: {
        7: 'monterey-2',
        9: 'monterey-3',
        11: 'monterey-4',
        13: 'monterey-5',
        15: 'monterey-6',
        16: 'monterey-7',
        17: 'monterey-8',
        18: 'monterey-1',
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
    thumbnail: 'big-sur-graphic-2',
    timestamps: {
      wallpaper: {
        7: 'big-sur-graphic-2',
        18: 'big-sur-graphic-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  'big-sur': {
    name: 'Big sur',
    type: 'dynamic',
    thumbnail: 'big-sur-4',
    timestamps: {
      wallpaper: {
        7: 'big-sur-2',
        9: 'big-sur-3',
        11: 'big-sur-4',
        13: 'big-sur-5',
        15: 'big-sur-6',
        16: 'big-sur-7',
        17: 'big-sur-8',
        18: 'big-sur-1',
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
    thumbnail: 'catalina-3',
    timestamps: {
      wallpaper: {
        7: 'catalina-2',
        9: 'catalina-3',
        11: 'catalina-4',
        13: 'catalina-5',
        15: 'catalina-6',
        16: 'catalina-7',
        17: 'catalina-8',
        18: 'catalina-1',
      },
      theme: {
        9: 'light',
        17: 'dark',
      },
    },
  },

  mojave: {
    name: 'Mojave',
    type: 'dynamic',
    thumbnail: 'mojave-2',
    timestamps: {
      wallpaper: {
        7: 'mojave-2',
        18: 'mojave-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  desert: {
    name: 'The Desert',
    type: 'dynamic',
    thumbnail: 'desert-5',
    timestamps: {
      wallpaper: {
        7: 'desert-2',
        9: 'desert-3',
        11: 'desert-4',
        13: 'desert-5',
        15: 'desert-6',
        16: 'desert-7',
        17: 'desert-8',
        18: 'desert-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  dome: {
    name: 'Dome',
    type: 'dynamic',
    thumbnail: 'dome-2',
    timestamps: {
      wallpaper: {
        7: 'dome-2',
        18: 'dome-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  peak: {
    name: 'Peak',
    type: 'dynamic',
    thumbnail: 'peak-2',
    timestamps: {
      wallpaper: {
        7: 'peak-2',
        18: 'peak-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  iridescence: {
    name: 'Iridescence',
    type: 'dynamic',
    thumbnail: 'iridescence-2',
    timestamps: {
      wallpaper: {
        7: 'iridescence-2',
        18: 'iridescence-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  lake: {
    name: 'Lake',
    type: 'dynamic',
    thumbnail: 'lake-4',
    timestamps: {
      wallpaper: {
        7: 'lake-2',
        9: 'lake-3',
        11: 'lake-4',
        13: 'lake-5',
        15: 'lake-6',
        16: 'lake-7',
        17: 'lake-8',
        18: 'lake-1',
      },
      theme: {
        7: 'light',
        18: 'dark',
      },
    },
  },

  'solar-grad': {
    name: 'Solar Grad',
    type: 'dynamic',
    thumbnail: 'solar-grad-11',
    timestamps: {
      wallpaper: {
        6: 'solar-grad-2',
        7: 'solar-grad-3',
        8: 'solar-grad-4',
        9: 'solar-grad-5',
        10: 'solar-grad-6',
        11: 'solar-grad-7',
        12: 'solar-grad-8',
        13: 'solar-grad-9',
        14: 'solar-grad-10',
        15: 'solar-grad-11',
        16: 'solar-grad-12',
        17: 'solar-grad-13',
        18: 'solar-grad-14',
        19: 'solar-grad-5',
        20: 'solar-grad-6',
      },
      theme: {
        6: 'light',
        20: 'dark',
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
