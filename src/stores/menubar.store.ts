import { atom } from 'jotai';
import { finderMenuConfig } from '__/data/menu/finder.menu.config';

const menuConfigs = { finder: finderMenuConfig };

export const menuBarMenusStore = atom(
  // Uncomment when all apps get their own menus
  // (get) => menuConfigs[get(activeAppStore) as keyof typeof menuConfigs],
  menuConfigs.finder,
);

export const activeMenuStore = atom<string>('');
