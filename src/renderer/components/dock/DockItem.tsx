import { useEffect, useRef, useState } from 'react';
import { appRegistry } from '@/config/apps';
import type { AppId } from '@/lib/apps';
import { openExternal } from '@/lib/utils/desktop';
import { useWindowsStore } from '@/stores/windowsStore';

type DockItemProps = {
  appId: AppId;
  mouseX: number | null;
};

function getScale(distance: number) {
  if (distance > 180) {
    return 1;
  }

  return 1 + ((180 - distance) / 180) * 0.9;
}

export function DockItem({ appId, mouseX }: DockItemProps) {
  const definition = appRegistry[appId];
  const ref = useRef<HTMLButtonElement | null>(null);
  const [scale, setScale] = useState(1);
  const openApp = useWindowsStore((state) => state.openApp);
  const focusApp = useWindowsStore((state) => state.focusApp);
  const isOpen = useWindowsStore((state) => state.windows[appId].open);

  useEffect(() => {
    if (mouseX === null || !ref.current) {
      setScale(1);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - centerX);

    setScale(getScale(distance));
  }, [mouseX]);

  return (
    <button
      aria-label={`Launch ${definition.title}`}
      className="dock-item-button no-drag"
      data-testid={`dock-item-${appId}`}
      onClick={async () => {
        if (definition.launchKind === 'external') {
          await openExternal(definition.href!);
          return;
        }

        openApp(appId);
        focusApp(appId);
      }}
      ref={ref}
      style={{
        transform: `translateY(${(1 - scale) * 18}px) scale(${scale})`,
      }}
      type="button"
    >
      <span className="dock-tooltip">{definition.title}</span>
      <img alt={definition.title} draggable="false" height={64} src={definition.icon} width={64} />
      <div className="dock-item-dot" style={{ opacity: isOpen ? 1 : 0 }} />
    </button>
  );
}
