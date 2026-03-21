import { useCallback, useRef } from 'react';
import { appRegistry } from '@/config/apps';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { openExternal } from '@/lib/utils/desktop';
import { useMenuBarStore } from '@/stores/menuBarStore';
import { useWindowsStore } from '@/stores/windowsStore';
import { MenuPopover } from './MenuPopover';

export function MenuBar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeMenu = useMenuBarStore((state) => state.activeMenu);
  const menus = useMenuBarStore((state) => state.menus);
  const openMenu = useMenuBarStore((state) => state.openMenu);
  const closeMenu = useMenuBarStore((state) => state.closeMenu);
  const openApp = useWindowsStore((state) => state.openApp);

  useOnClickOutside(containerRef, closeMenu);

  const handleMenuAction = useCallback(
    async (menuId: string) => {
      switch (menuId) {
        case 'about-this-mac':
          openApp('purus-twitter');
          break;
        case 'system-preferences':
        case 'preferences':
          openApp('wallpapers');
          break;
        case 'app-store':
          openApp('appstore');
          break;
        case 'new-finder-window':
          openApp('finder');
          break;
        case 'send-finder-feedback':
        case 'macos-help':
          await openExternal(appRegistry['view-source'].href!);
          break;
        default:
          break;
      }

      closeMenu();
    },
    [closeMenu, openApp],
  );

  return (
    <div className="menu-bar" ref={containerRef}>
      {Object.entries(menus).map(([menuId, menuSection]) => (
        <div className="menu-button-group" key={menuId}>
          <button
            className="menu-button no-drag"
            data-active={activeMenu === menuId}
            onClick={() => openMenu(activeMenu === menuId ? '' : menuId)}
            onMouseEnter={() => {
              if (activeMenu) {
                openMenu(menuId);
              }
            }}
            type="button"
          >
            {menuId === 'apple' ? <span className="apple-mark">OS</span> : menuSection.title}
          </button>

          {activeMenu === menuId ? (
            <div className="menu-popover-anchor">
              <MenuPopover menu={menuSection.menu} onSelect={handleMenuAction} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
