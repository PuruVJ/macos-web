import { useEffect } from 'react';
import { usePreferencesStore } from '@/stores/preferencesStore';

export function useWallpaperScheduler() {
  const syncWallpaperSchedule = usePreferencesStore((state) => state.syncWallpaperSchedule);

  useEffect(() => {
    syncWallpaperSchedule();

    const timer = window.setInterval(() => {
      syncWallpaperSchedule();
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [syncWallpaperSchedule]);
}
