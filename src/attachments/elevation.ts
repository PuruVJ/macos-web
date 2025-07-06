import type { Attachment } from 'svelte/attachments';

const z_index_config = {
	wallpaper: -1,
	'bootup-screen': 110,
	'context-menu': 100,
	'window-traffic-lights': 10,
	dock: 80,
	'dock-tooltip': 70,
	'system-updates-available': 60,
	'system-dialog': 90,
	'menubar-menu-parent': 160,
};

for (const [element, zIndexValue] of Object.entries(z_index_config)) {
	document.body.style.setProperty(`--system-z-index-${element}`, zIndexValue + '');
}

export function elevation(ui_element: keyof typeof z_index_config): Attachment<HTMLElement> {
	return (node) => {
		node.style.zIndex = `var(--system-z-index-${ui_element})`;
	};
}
