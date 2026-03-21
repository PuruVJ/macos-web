import { useEffect, useState } from 'react';
import { Dock } from '@/components/dock/Dock';
import { BootSplash } from '@/components/overlays/BootSplash';
import { UpdateOverlay } from '@/components/overlays/UpdateOverlay';
import { TopBar } from '@/components/topbar/TopBar';
import { WindowsLayer } from '@/components/windows/WindowsLayer';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { useWindowsStore } from '@/stores/windowsStore';

export function DesktopShell() {
  const wallpaperImage = usePreferencesStore((state) => state.wallpaper.image);
  const setViewport = useWindowsStore((state) => state.setViewport);
  const hasFullscreenWindow = useWindowsStore((state) =>
    Object.values(state.windows).some((windowState) => windowState.open && windowState.fullscreen),
  );
  const [mouseY, setMouseY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setViewportHeight(window.innerHeight);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, [setViewport]);

  return (
    <div className="desktop-shell" onPointerMove={(event) => setMouseY(event.clientY)}>
      <div
        aria-hidden="true"
        className="desktop-wallpaper"
        style={{ backgroundImage: `url(${wallpaperImage})` }}
      />
      <div className="desktop-vignette" />

      <main className="desktop-main">
        <TopBar />
        <WindowsLayer />
        <Dock
          hasFullscreenWindow={hasFullscreenWindow}
          mouseY={mouseY}
          viewportHeight={viewportHeight}
        />
      </main>

      <BootSplash />
      <UpdateOverlay />
    </div>
  );
}
