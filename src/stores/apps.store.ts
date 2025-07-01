import { atom } from 'jotai';
import { appsConfig } from '__/data/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openAppsStore = atom<Record<AppID, boolean>>({
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
export const activeAppStore = atom<AppID>('finder');

/**
 * Maximum zIndex for the active app
 * Initialize with -2, so that it becomes 0 when initialised
 */
export const activeAppZIndexStore = atom(-2);
