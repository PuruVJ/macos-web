import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { DesktopShell } from '@/components/desktop/DesktopShell';
import { useDesktopBootstrap } from '@/hooks/useDesktopBootstrap';
import { useDesktopRouteSync } from '@/hooks/useDesktopRouteSync';
import { usePreferenceEffects } from '@/hooks/usePreferenceEffects';
import { useWallpaperScheduler } from '@/hooks/useWallpaperScheduler';

export function DesktopRoot() {
  useDesktopBootstrap();
  usePreferenceEffects();
  useWallpaperScheduler();
  useDesktopRouteSync();

  return (
    <>
      <DesktopShell />
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </>
  );
}
