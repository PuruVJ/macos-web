import { useEffect } from 'react';
import { getDesktopPlatform, getDesktopVersion } from '@/lib/utils/desktop';
import { useSystemStore } from '@/stores/systemStore';

export function useDesktopBootstrap() {
  const hideBoot = useSystemStore((state) => state.hideBoot);
  const hydrateDesktopMeta = useSystemStore((state) => state.hydrateDesktopMeta);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hideBoot();
    }, import.meta.env.DEV ? 0 : 2400);

    void Promise.all([getDesktopPlatform(), getDesktopVersion()]).then(([platform, version]) => {
      hydrateDesktopMeta(platform, version);
    });

    return () => {
      window.clearTimeout(timer);
    };
  }, [hideBoot, hydrateDesktopMeta]);
}
