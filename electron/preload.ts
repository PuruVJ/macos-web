import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopApi } from '@shared/desktop';

const desktopApi: DesktopApi = {
  getPlatform: () => ipcRenderer.invoke('desktop:get-platform'),
  getVersion: () => ipcRenderer.invoke('desktop:get-version'),
  openExternal: (url) => ipcRenderer.invoke('desktop:open-external', url),
  window: {
    minimize: () => ipcRenderer.invoke('desktop:window-minimize'),
    maximizeToggle: () => ipcRenderer.invoke('desktop:window-maximize-toggle'),
    close: () => ipcRenderer.invoke('desktop:window-close'),
  },
};

contextBridge.exposeInMainWorld('desktop', desktopApi);
