import { writable } from 'svelte/store';
import type { appsConfig } from '__/configs/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openApps = writable<Record<AppID, boolean>>({
  finder: false,
  vscode: false,
  calculator: false,
  safari: false,
  messages: false,
  mail: false,
  photos: false,
  facetime: false,
  calendar: false,
  'system-preferences': false,

  'purus-twitter': true,
  'view-source': true,
});

/** Which app is currently focused */
export const activeApp = writable<AppID>('finder');

/**
 * Maximum zIndex for the active app
 * Initialize with -2, so that it becomes 0 when initialised
 */
export const activeAppZIndex = writable(-2);
