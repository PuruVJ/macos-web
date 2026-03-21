import type { DesktopPlatform } from '@shared/desktop';

export async function getDesktopPlatform(): Promise<DesktopPlatform> {
  if (window.desktop) {
    return window.desktop.getPlatform();
  }

  return navigator.userAgent.toLowerCase().includes('mac')
    ? 'darwin'
    : navigator.userAgent.toLowerCase().includes('win')
      ? 'win32'
      : 'linux';
}

export async function getDesktopVersion() {
  if (window.desktop) {
    return window.desktop.getVersion();
  }

  return 'dev';
}

export async function openExternal(url: string) {
  if (window.desktop) {
    await window.desktop.openExternal(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
