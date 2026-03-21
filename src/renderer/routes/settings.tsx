import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWindowsStore } from '@/stores/windowsStore';

function SettingsRouteComponent() {
  const openApp = useWindowsStore((state) => state.openApp);
  const focusApp = useWindowsStore((state) => state.focusApp);

  useEffect(() => {
    openApp('wallpapers');
    focusApp('wallpapers');
  }, [focusApp, openApp]);

  return null;
}

export const Route = createFileRoute('/settings')({
  component: SettingsRouteComponent,
});
