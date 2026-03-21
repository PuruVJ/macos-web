import { create } from 'zustand';
import type { DesktopPlatform } from '@shared/desktop';

type SystemStore = {
  bootVisible: boolean;
  needsUpdate: boolean;
  platform: DesktopPlatform | null;
  version: string | null;
  hideBoot: () => void;
  setNeedsUpdate: (value: boolean) => void;
  hydrateDesktopMeta: (platform: DesktopPlatform, version: string) => void;
};

export const useSystemStore = create<SystemStore>((set) => ({
  bootVisible: !import.meta.env.DEV,
  needsUpdate: false,
  platform: null,
  version: null,
  hideBoot: () => set({ bootVisible: false }),
  setNeedsUpdate: (value) => set({ needsUpdate: value }),
  hydrateDesktopMeta: (platform, version) => set({ platform, version }),
}));
