import { persisted } from 'svelte-persisted-store';
import { finderMenuConfig } from '🍎/configs/menu/finder.menu.config';

const menuConfigs = { finder: finderMenuConfig };

export const shouldShowNotch = persisted('macos:setting:should-show-notch', false);

export const menubar_state = $state({
  menus: menuConfigs.finder,
  active: '' as string,
});
