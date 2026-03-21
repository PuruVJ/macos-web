import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { appRegistry } from '@/config/apps';
import { useWindowsStore } from '@/stores/windowsStore';

export function useDesktopRouteSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeAppId = useWindowsStore((state) => state.activeAppId);
  const windows = useWindowsStore((state) => state.windows);

  useEffect(() => {
    const activeWindow = appRegistry[activeAppId];
    const isActiveWindowOpen = windows[activeAppId]?.open;

    if (!activeWindow || activeWindow.launchKind !== 'window' || !isActiveWindowOpen) {
      if (location.pathname.startsWith('/app/')) {
        void navigate({ replace: true, to: '/' });
      }
      return;
    }

    if (location.pathname !== activeWindow.routePath) {
      void navigate({ replace: true, to: '/app/$appId', params: { appId: activeAppId } });
    }
  }, [activeAppId, location.pathname, navigate, windows]);
}

export function useOpenAppFromRoute() {
  const { appId } = useParams({ strict: false });
  const openApp = useWindowsStore((state) => state.openApp);
  const focusApp = useWindowsStore((state) => state.focusApp);

  useEffect(() => {
    const routeAppId =
      typeof appId === 'string' && Object.prototype.hasOwnProperty.call(appRegistry, appId)
        ? (appId as keyof typeof appRegistry)
        : null;

    if (!routeAppId) {
      return;
    }

    const definition = appRegistry[routeAppId];

    if (definition.launchKind !== 'window') {
      return;
    }

    openApp(routeAppId);
    focusApp(routeAppId);
  }, [appId, focusApp, openApp]);
}
