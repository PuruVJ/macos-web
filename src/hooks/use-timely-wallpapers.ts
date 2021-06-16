import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { wallpapersConfig } from '__/data/wallpapers/wallpapers.config';
import { smallerClosestValue } from '__/helpers/smaller-closest-value';
import { wallpaperImageStore } from '__/stores/wallpapers.store';
import { useInterval } from './use-interval';
import { useTheme } from './use-theme';
import { useWallpaperName } from './use-wallpaper-name';

export const useTimelyWallpapers = () => {
  const [wallpaperName] = useWallpaperName();
  const [currWallpaperImg, setCurrWallpaperImg] = useAtom(wallpaperImageStore);
  const [, setTheme] = useTheme();

  function handleWallpaper() {
    const date = new Date();
    const hour = date.getHours();

    const wallpaperTimestampsMap = wallpapersConfig[wallpaperName].wallpaperTimestamps;
    const timestamps = Object.keys(wallpaperTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      setCurrWallpaperImg(wallpaperTimestampsMap?.[maxTimestamp] || currWallpaperImg);
      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smallerClosestValue(timestamps, hour);
    setCurrWallpaperImg(wallpaperTimestampsMap?.[chosenTimeStamp] || currWallpaperImg);
  }

  function handleTheme() {
    const date = new Date();
    const hour = date.getHours();

    const themeTimestampsMap = wallpapersConfig[wallpaperName].themeTimestamps;
    const timestamps = Object.keys(themeTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      setTheme('dark');
      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smallerClosestValue(timestamps, hour);
    setTheme(themeTimestampsMap?.[chosenTimeStamp] || 'light');
  }

  function handler() {
    if (wallpapersConfig[wallpaperName].type === 'standalone') return;
    /** Only dynamic and light/dark wallpaper logic to tackle */
    // Now check if user really wants the change to happen.

    handleTheme();
    handleWallpaper();
  }

  useEffect(() => {
    handler();
  }, [wallpaperName]);

  useInterval(() => {
    handler();
  }, 60 * 1000);

  return [currWallpaperImg, setCurrWallpaperImg] as const;
};
