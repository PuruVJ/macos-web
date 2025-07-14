import * as v from 'valibot';
import { Persisted } from './persisted.svelte.ts';
import { finder_menu_config } from '🍎/configs/menu/finder.menu.config';

const menu_configs = { finder: finder_menu_config };

export const should_show_notch = new Persisted('macos:setting:notch', false, v.boolean());

export const menubar_state = $state({
	menus: menu_configs.finder,
	active: '' as string,
});
