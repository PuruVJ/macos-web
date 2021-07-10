import { atom } from 'jotai';
import { finderMenuConfig } from '__/data/menu/finder.menu.config';

export const menuBarMenusStore = atom<Record<any, any>>(
  // All apps will load their own configs, to support code splitting
  {},
);

export const activeMenuStore = atom<string>('');
