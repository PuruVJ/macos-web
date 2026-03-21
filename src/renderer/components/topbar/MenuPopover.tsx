import type { MenuSection } from '@/config/menus';

type MenuPopoverProps = {
  menu: MenuSection['menu'];
  onSelect: (menuId: string) => void;
};

export function MenuPopover({ menu, onSelect }: MenuPopoverProps) {
  return (
    <section className="menu-popover no-drag">
      {Object.entries(menu).map(([menuId, item]) => (
        <div key={menuId}>
          <button
            className="menu-item"
            disabled={item.disabled}
            onClick={() => onSelect(menuId)}
            type="button"
          >
            {item.title}
          </button>
          {item.breakAfter ? <div className="menu-divider" /> : null}
        </div>
      ))}
    </section>
  );
}
