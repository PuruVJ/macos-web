import { Suspense } from 'react';
import { Rnd } from 'react-rnd';
import { appRegistry } from '@/config/apps';
import type { AppId } from '@/lib/apps';
import { AppSurface } from '@/components/apps';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { useWindowsStore } from '@/stores/windowsStore';
import { TrafficLights } from './TrafficLights';

type AppWindowProps = {
  appId: AppId;
};

export function AppWindow({ appId }: AppWindowProps) {
  const definition = appRegistry[appId];
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion);
  const activeAppId = useWindowsStore((state) => state.activeAppId);
  const windowState = useWindowsStore((state) => state.windows[appId]);
  const focusApp = useWindowsStore((state) => state.focusApp);
  const closeApp = useWindowsStore((state) => state.closeApp);
  const setDragging = useWindowsStore((state) => state.setDragging);
  const toggleFullscreen = useWindowsStore((state) => state.toggleFullscreen);
  const updateBounds = useWindowsStore((state) => state.updateBounds);

  if (!windowState.open || !windowState.bounds) {
    return null;
  }

  return (
    <Rnd
      bounds="parent"
      className={`app-window ${activeAppId === appId ? 'active' : ''}`}
      data-testid={`window-${appId}`}
      disableDragging={windowState.fullscreen}
      dragHandleClassName="window-drag-handle"
      enableResizing={definition.resizable && !windowState.fullscreen}
      minHeight={220}
      minWidth={Math.min(definition.defaultBounds.width || 320, 320)}
      onDragStart={() => {
        focusApp(appId);
        setDragging(appId, true);
      }}
      onDragStop={(_event, data) => {
        setDragging(appId, false);
        updateBounds(appId, {
          ...windowState.bounds!,
          x: data.x,
          y: data.y,
        });
      }}
      onMouseDown={() => focusApp(appId)}
      onResizeStop={(_event, _direction, ref, _delta, position) => {
        updateBounds(appId, {
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      position={{
        x: windowState.bounds.x,
        y: windowState.bounds.y,
      }}
      size={{
        width: windowState.bounds.width,
        height: windowState.bounds.height,
      }}
      style={{
        transition: reducedMotion ? 'none' : undefined,
        zIndex: windowState.zIndex,
      }}
    >
      <section className="app-window-shell">
        <header className="app-window-titlebar window-drag-handle">
          <TrafficLights
            appId={appId}
            onClose={() => closeApp(appId)}
            onMinimize={() => closeApp(appId)}
            onToggleFullscreen={() => toggleFullscreen(appId)}
          />
          <div className="app-window-title">{definition.title}</div>
        </header>

        <div className="window-content">
          <Suspense fallback={<div className="app-loading">Loading {definition.title}...</div>}>
            <AppSurface appId={appId} />
          </Suspense>
        </div>
      </section>
    </Rnd>
  );
}
