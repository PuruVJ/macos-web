import { create } from 'zustand';
import { finderMenus } from '@/config/menus';

type MenuBarStore = {
  activeMenu: string;
  menus: typeof finderMenus;
  openMenu: (menuId: string) => void;
  closeMenu: () => void;
};

export const useMenuBarStore = create<MenuBarStore>((set) => ({
  activeMenu: '',
  menus: finderMenus,
  openMenu: (menuId) => set({ activeMenu: menuId }),
  closeMenu: () => set({ activeMenu: '' }),
}));
