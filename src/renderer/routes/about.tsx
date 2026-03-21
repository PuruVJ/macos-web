import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWindowsStore } from '@/stores/windowsStore';

function AboutRouteComponent() {
  const openApp = useWindowsStore((state) => state.openApp);
  const focusApp = useWindowsStore((state) => state.focusApp);

  useEffect(() => {
    openApp('purus-twitter');
    focusApp('purus-twitter');
  }, [focusApp, openApp]);

  return null;
}

export const Route = createFileRoute('/about')({
  component: AboutRouteComponent,
});
