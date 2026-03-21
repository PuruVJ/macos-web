import type { DesktopApi } from '@shared/desktop';

declare global {
  interface Window {
    desktop?: DesktopApi;
  }
}

export {};
