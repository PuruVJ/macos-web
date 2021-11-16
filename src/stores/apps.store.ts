import { writable } from 'svelte/store';
import type { appsConfig } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openApps = writable<Record<AppID, boolean>>({
  wallpapers: false,
  finder: false,
  vscode: false,
  calculator: false,
  safari: false,
  appstore: false,
  calendar: false,
  'system-preferences': false,

  'purus-twitter': true,
  'view-source': true,
  devutils: true,
});

/** Which app is currently focused */
export const activeApp = writable<AppID>('finder');

/**
 * Maximum zIndex for the active app
 * Initialize with -2, so that it becomes 0 when initialised
 */
export const activeAppZIndex = writable(-2);
