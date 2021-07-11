/* `useWallpaperName` starts here */

import { useAtom } from 'jotai';
import { wallpaperNameStore } from '__/stores/wallpapers.store';

export function useWallpaperName() {
  const [wallpaperName, setWallpaperName] = useAtom(wallpaperNameStore);

  return [wallpaperName, setWallpaperName] as const;
}
