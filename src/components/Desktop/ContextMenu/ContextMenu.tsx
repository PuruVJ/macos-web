import { ComponentChildren, RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { RovingTabIndexProvider, useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { contextMenuConfig } from '__/data/menu/context.menu.config';
import { useContextMenu, useFocusOutside } from '__/hooks';
import css from './ContextMenu.module.scss';

type Props = {
  outerRef: RefObject<HTMLDivElement>;
};

export const ContextMenu = ({ outerRef }: Props) => {
  const { xPos, yPos, isMenuVisible, setIsMenuVisible } = useContextMenu(outerRef);

  const containerRef = useRef<HTMLDivElement>();

  const defMenu = contextMenuConfig.default;

  useEffect(() => {
    isMenuVisible && containerRef.current.focus();
  }, [isMenuVisible]);

  useFocusOutside(containerRef, () => isMenuVisible && setIsMenuVisible(false));

  return isMenuVisible ? (
    <div
      class={css.contextContainer}
      tabIndex={-1}
      ref={containerRef}
      style={{ top: yPos, left: xPos }}
    >
      <RovingTabIndexProvider options={{ direction: 'vertical', loopAround: true }}>
        {Object.keys(defMenu).map((key) => (
          <>
            <ContextMenuButton>{defMenu[key].title}</ContextMenuButton>
            {(defMenu[key] as any).breakAfter && <div class={css.divider}></div>}
          </>
        ))}
      </RovingTabIndexProvider>
    </div>
  ) : (
    <></>
  );
};

type ContextMenuButtonProps = {
  children: ComponentChildren;
};

const ContextMenuButton = ({ children }: ContextMenuButtonProps) => {
  const ref = useRef<HTMLButtonElement>();

  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(ref, false);

  useFocusEffect(focused, ref);

  return (
    <button
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      tabIndex={tabIndex}
      ref={ref}
      class={css.menuItem}
    >
      {children}
    </button>
  );
};
