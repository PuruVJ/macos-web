import { create } from 'zustand';
import { appRegistry } from '@/config/apps';
import type { AppId } from '@/lib/apps';

const MAX_Z_INDEX = 50;
const TOP_BAR_HEIGHT = 30;
const DESKTOP_PADDING = 24;
const DEFAULT_VIEWPORT = { width: 1440, height: 900 };

export type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WindowState = {
  open: boolean;
  zIndex: number;
  fullscreen: boolean;
  isDragging: boolean;
  bounds: WindowBounds | null;
  previousBounds: WindowBounds | null;
};

type WindowsStore = {
  viewport: {
    width: number;
    height: number;
  };
  activeAppId: AppId;
  activeZIndex: number;
  windows: Record<AppId, WindowState>;
  setViewport: (viewport: { width: number; height: number }) => void;
  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  focusApp: (appId: AppId) => void;
  setDragging: (appId: AppId, value: boolean) => void;
  updateBounds: (appId: AppId, bounds: WindowBounds) => void;
  toggleFullscreen: (appId: AppId) => void;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getAppOffset(appId: AppId) {
  const seed = [...appId].reduce((value, char) => value + char.charCodeAt(0), 0);

  return {
    x: ((seed % 9) - 4) * 24,
    y: ((seed % 7) - 3) * 16,
  };
}

export function getDefaultWindowBounds(appId: AppId, viewport = DEFAULT_VIEWPORT): WindowBounds {
  const definition = appRegistry[appId];
  const width = Math.min(definition.defaultBounds.width, viewport.width - DESKTOP_PADDING * 2);
  const height = Math.min(
    definition.defaultBounds.height,
    viewport.height - TOP_BAR_HEIGHT - DESKTOP_PADDING * 2,
  );
  const offset = getAppOffset(appId);
  const maxX = viewport.width - width - DESKTOP_PADDING;
  const maxY = viewport.height - height - DESKTOP_PADDING;

  return {
    width,
    height,
    x: clamp((viewport.width - width) / 2 + offset.x, DESKTOP_PADDING, Math.max(maxX, 0)),
    y: clamp(
      TOP_BAR_HEIGHT + (viewport.height - TOP_BAR_HEIGHT - height) / 2 + offset.y,
      TOP_BAR_HEIGHT + 12,
      Math.max(maxY, TOP_BAR_HEIGHT + 12),
    ),
  };
}

export function createInitialWindowsState() {
  const windows = {} as Record<AppId, WindowState>;

  for (const appId of Object.keys(appRegistry) as AppId[]) {
    windows[appId] = {
      open: Boolean(appRegistry[appId].initiallyOpen),
      zIndex: 0,
      fullscreen: false,
      isDragging: false,
      bounds: null,
      previousBounds: null,
    };
  }

  return windows;
}

function normalizeZIndices(windows: Record<AppId, WindowState>, activeZIndex: number) {
  const values = Object.values(windows).map((windowState) => windowState.zIndex);

  if (!values.some((value) => value > MAX_Z_INDEX)) {
    return { windows, activeZIndex };
  }

  const lowest = Math.min(...values.filter((value) => value > 0));
  const normalizedWindows = { ...windows };

  for (const appId of Object.keys(normalizedWindows) as AppId[]) {
    if (normalizedWindows[appId].zIndex >= lowest) {
      normalizedWindows[appId] = {
        ...normalizedWindows[appId],
        zIndex: normalizedWindows[appId].zIndex - lowest,
      };
    }
  }

  return {
    windows: normalizedWindows,
    activeZIndex: activeZIndex - lowest,
  };
}

export const useWindowsStore = create<WindowsStore>()((set, get) => ({
  viewport: DEFAULT_VIEWPORT,
  activeAppId: 'finder',
  activeZIndex: -2,
  windows: createInitialWindowsState(),
  setViewport: (viewport) => set({ viewport }),
  openApp: (appId) =>
    set((state) => {
      const nextZIndex = state.activeZIndex + 2;
      const currentBounds = state.windows[appId].bounds;
      const windows = {
        ...state.windows,
        [appId]: {
          ...state.windows[appId],
          open: true,
          bounds: currentBounds ?? getDefaultWindowBounds(appId, state.viewport),
          zIndex: nextZIndex,
        },
      };
      const normalized = normalizeZIndices(windows, nextZIndex);

      return {
        activeAppId: appId,
        activeZIndex: normalized.activeZIndex,
        windows: normalized.windows,
      };
    }),
  closeApp: (appId) =>
    set((state) => ({
      activeAppId: state.activeAppId === appId ? 'finder' : state.activeAppId,
      windows: {
        ...state.windows,
        [appId]: {
          ...state.windows[appId],
          open: false,
          fullscreen: false,
          isDragging: false,
        },
      },
    })),
  focusApp: (appId) =>
    set((state) => {
      const nextZIndex = state.activeZIndex + 2;
      const windows = {
        ...state.windows,
        [appId]: {
          ...state.windows[appId],
          zIndex: nextZIndex,
        },
      };
      const normalized = normalizeZIndices(windows, nextZIndex);

      return {
        activeAppId: appId,
        activeZIndex: normalized.activeZIndex,
        windows: normalized.windows,
      };
    }),
  setDragging: (appId, value) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [appId]: {
          ...state.windows[appId],
          isDragging: value,
        },
      },
    })),
  updateBounds: (appId, bounds) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [appId]: {
          ...state.windows[appId],
          bounds,
        },
      },
    })),
  toggleFullscreen: (appId) =>
    set((state) => {
      const windowState = state.windows[appId];

      if (!windowState.fullscreen) {
        return {
          windows: {
            ...state.windows,
            [appId]: {
              ...windowState,
              fullscreen: true,
              previousBounds: windowState.bounds ?? getDefaultWindowBounds(appId, state.viewport),
              bounds: {
                x: 0,
                y: TOP_BAR_HEIGHT,
                width: state.viewport.width,
                height: Math.max(state.viewport.height - TOP_BAR_HEIGHT, 320),
              },
            },
          },
        };
      }

      return {
        windows: {
          ...state.windows,
          [appId]: {
            ...windowState,
            fullscreen: false,
            bounds: windowState.previousBounds ?? getDefaultWindowBounds(appId, state.viewport),
          },
        },
      };
    }),
}));
