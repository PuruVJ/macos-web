import { writable } from 'svelte/store';
import type { appsConfig } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openApps = writable<Record<AppID, boolean>>({
  wallpapers: false,
  finder: true,
  vscode: false,
  calculator: false,
  // safari: false,
  appstore: false,
  calendar: false,
  // 'system-preferences': false,

  'purus-twitter': false,
  'view-source': true,

  vercel: true,

  ukraine: true,
});

/** Which app is currently focused */
export const activeApp = writable<AppID>('finder');

/**
 * Maximum zIndex for the active app
 * Initialize with -2, so that it becomes 0 when initialised
 */
export const activeAppZIndex = writable(-2);

export const appZIndices = writable<Record<AppID, number>>({
  wallpapers: 0,
  finder: 0,
  vscode: 0,
  calculator: 0,
  // safari: 0,
  appstore: 0,
  calendar: 0,
  // 'system-preferences': 0,

  'purus-twitter': 0,
  'view-source': 0,

  vercel: 0,

  ukraine: 0,
});

export const isAppBeingDragged = writable(false);

export const appsInFullscreen = writable<Record<AppID, boolean>>({
  wallpapers: false,
  finder: false,
  vscode: false,
  calculator: false,
  // safari: false,
  appstore: false,
  calendar: false,
  // 'system-preferences': false,

  'purus-twitter': false,
  'view-source': false,

  vercel: false,

  ukraine: false,
});
