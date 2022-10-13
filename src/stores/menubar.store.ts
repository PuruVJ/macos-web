import { writable } from 'svelte/store';
import { writable as localWritable } from 'svelte-local-storage-store';
import { finderMenuConfig } from '🍎/configs/menu/finder.menu.config';

const menuConfigs = { finder: finderMenuConfig };

export const menuBarMenus = writable(
  // Uncomment when all apps get their own menus
  // (get) => menuConfigs[get(activeAppStore) as keyof typeof menuConfigs],
  menuConfigs.finder,
);

export const activeMenu = writable('');

export const shouldShowNotch = localWritable('macos:setting:should-show-notch', false);
