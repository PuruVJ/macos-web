import { mdiApple } from '@mdi/js';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { AppIcon } from '__/components/utils/AppIcon';
import { finderMenuConfig } from '__/data/menu/finder.menu.config';
import { useFocusOutside, useOutsideClick, usePrevious } from '__/hooks';
import { activeAppStore, openAppsStore } from '__/stores/apps.store';
import { activeMenuStore, menuBarMenusStore } from '__/stores/menubar.store';
import { Menu } from './Menu';
import css from './MenuBar.module.scss';

export const MenuBar = () => {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuStore);
  const [currentAppMenus] = useRightMenusForRightApp();

  const parentRef = useRef<HTMLDivElement>();

  /** Close when document focus isn't in any menubar */
  useFocusOutside(parentRef, () => setActiveMenu(''));

  /** Close when clicked outside */
  useOutsideClick(parentRef, () => setActiveMenu(''));

  return (
    <div class={css.container} ref={parentRef}>
      {Object.keys(currentAppMenus).map((menuID) => (
        <div key={menuID}>
          <span style={{ height: '100%' }}>
            <button
              onClick={() => setActiveMenu(menuID)}
              onMouseOver={() => activeMenu && setActiveMenu(menuID)}
              onFocus={() => setActiveMenu(menuID)}
              class={clsx({
                [css.menuButton]: true,
                [css.defaultMenu]: menuID === 'default',
                [css.appleIconButton]: menuID === 'apple',
              })}
              style={{ '--scale': activeMenu === menuID ? 1 : 0 } as React.CSSProperties}
            >
              {menuID === 'apple' ? (
                <AppIcon size={18} path={mdiApple} />
              ) : (
                currentAppMenus[menuID].title
              )}
            </button>
          </span>
          <div
            class={css.menuParent}
            style={{
              visibility: activeMenu !== menuID ? 'hidden' : 'visible',
            }}
          >
            <Menu menu={currentAppMenus[menuID].menu} />
          </div>
        </div>
      ))}
    </div>
  );
};

const useRightMenusForRightApp = () => {
  const [activeApp] = useAtom(activeAppStore);
  const [openApps] = useAtom(openAppsStore);

  const [currentAppMenus, setCurrentAppMenus] = useAtom(menuBarMenusStore);

  // Store previoussly active app to see if it is open now or now
  const prevActiveApp = usePrevious(activeApp || 'finder');

  useLayoutEffect(() => {
    async function main() {
      // If previous app was closed, revert to Finder
      if (prevActiveApp !== 'finder' && !openApps[prevActiveApp]) {
        return void setCurrentAppMenus(finderMenuConfig);
      }

      let config = finderMenuConfig;

      const allConfigs = import.meta.glob('../../../data/menu/*.menu.config.ts');

      const pathOfConfig = `../../../data/menu/${activeApp}.menu.config.ts`;

      try {
        config = (await allConfigs[pathOfConfig]()).default;
      } catch (e) {
        console.log(e);
      }

      setCurrentAppMenus(config);
    }

    main();
  }, [activeApp, openApps]);

  return [currentAppMenus] as const;
};
