import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { colors } from '@/config/colors';
import {
  resolveWallpaperFrame,
  wallpapers,
  type ThemeScheme,
  type WallpaperId,
} from '@/config/wallpapers';

export type PrimaryColor = keyof typeof colors;

export type PreferencesState = {
  reducedMotion: boolean;
  theme: {
    scheme: ThemeScheme;
    primaryColor: PrimaryColor;
  };
  wallpaper: {
    id: WallpaperId;
    image: string;
    canControlTheme: boolean;
  };
  shouldShowNotch: boolean;
};

type PreferencesStore = PreferencesState & {
  setReducedMotion: (value: boolean) => void;
  setThemeScheme: (scheme: ThemeScheme) => void;
  setPrimaryColor: (primaryColor: PrimaryColor) => void;
  setShouldShowNotch: (value: boolean) => void;
  selectWallpaper: (wallpaperId: WallpaperId) => void;
  setWallpaperThemeControl: (value: boolean) => void;
  syncWallpaperSchedule: (now?: Date) => void;
};

function getInitialScheme(): ThemeScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getWallpaperState(wallpaperId: WallpaperId, now = new Date()) {
  const frame = resolveWallpaperFrame(wallpapers[wallpaperId], now.getHours());

  return {
    id: wallpaperId,
    image: frame.image ?? wallpapers[wallpaperId].image ?? '',
    canControlTheme: wallpapers[wallpaperId].type === 'dynamic',
  };
}

export function createDefaultPreferencesState(): PreferencesState {
  return {
    reducedMotion: getInitialReducedMotion(),
    theme: {
      scheme: getInitialScheme(),
      primaryColor: 'blue',
    },
    wallpaper: getWallpaperState('ventura'),
    shouldShowNotch: false,
  };
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      ...createDefaultPreferencesState(),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setThemeScheme: (scheme) =>
        set((state) => ({
          theme: {
            ...state.theme,
            scheme,
          },
        })),
      setPrimaryColor: (primaryColor) =>
        set((state) => ({
          theme: {
            ...state.theme,
            primaryColor,
          },
        })),
      setShouldShowNotch: (value) => set({ shouldShowNotch: value }),
      selectWallpaper: (wallpaperId) => {
        const wallpaper = wallpapers[wallpaperId];
        const currentWallpaper = get().wallpaper;
        const nextWallpaper = getWallpaperState(wallpaperId);

        set({
          wallpaper: {
            ...nextWallpaper,
            canControlTheme:
              wallpaper.type === 'dynamic' ? currentWallpaper.canControlTheme : false,
          },
        });

        if (wallpaper.type === 'dynamic' && currentWallpaper.canControlTheme) {
          get().syncWallpaperSchedule();
        }
      },
      setWallpaperThemeControl: (value) =>
        set((state) => ({
          wallpaper: {
            ...state.wallpaper,
            canControlTheme: value,
          },
        })),
      syncWallpaperSchedule: (now = new Date()) => {
        const state = get();
        const wallpaper = wallpapers[state.wallpaper.id];
        const frame = resolveWallpaperFrame(wallpaper, now.getHours());

        set((currentState) => ({
          wallpaper: {
            ...currentState.wallpaper,
            image: frame.image ?? currentState.wallpaper.image,
          },
          theme:
            currentState.wallpaper.canControlTheme && frame.theme
              ? {
                  ...currentState.theme,
                  scheme: frame.theme,
                }
              : currentState.theme,
        }));
      },
    }),
    {
      name: 'macos:preferences',
      partialize: (state) => ({
        reducedMotion: state.reducedMotion,
        theme: state.theme,
        wallpaper: state.wallpaper,
        shouldShowNotch: state.shouldShowNotch,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
