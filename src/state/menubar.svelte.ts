import { persisted } from './persisted.svelte.ts';
import { finderMenuConfig } from '🍎/configs/menu/finder.menu.config';

const menuConfigs = { finder: finderMenuConfig };

export const should_show_notch = persisted('macos:setting:should-show-notch', false);

export const menubar_state = $state({
  menus: menuConfigs.finder,
  active: '' as string,
});
