export type DesktopPlatform = NodeJS.Platform;

export type DesktopApi = {
  getPlatform: () => Promise<DesktopPlatform>;
  getVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<void>;
  window: {
    minimize: () => Promise<void>;
    maximizeToggle: () => Promise<boolean>;
    close: () => Promise<void>;
  };
};
