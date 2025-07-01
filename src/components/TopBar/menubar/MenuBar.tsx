import { mdiApple } from '@mdi/js';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useRef } from 'preact/hooks';
import { AppIcon } from '__/components/utils/AppIcon';
import { useFocusOutside, useOutsideClick } from '__/hooks';
import { activeMenuStore, menuBarMenusStore } from '__/stores/menubar.store';
import { Menu } from './Menu';
import css from './MenuBar.module.scss';

export const MenuBar = () => {
  const [currentAppMenus] = useAtom(menuBarMenusStore);
  const [activeMenu, setActiveMenu] = useAtom(activeMenuStore);

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
