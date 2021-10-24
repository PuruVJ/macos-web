import { writable } from 'svelte/store';
import { finderMenuConfig } from '__/configs/menu/finder.menu.config';

const menuConfigs = { finder: finderMenuConfig };

export const menuBarMenus = writable(
  // Uncomment when all apps get their own menus
  // (get) => menuConfigs[get(activeAppStore) as keyof typeof menuConfigs],
  menuConfigs.finder,
);

export const activeMenu = writable('');
