import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;
export type WindowRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

export const apps = $state({
	open: {
		wallpapers: false,
		finder: true,
		vscode: false,
		calculator: false,
		// safari: false,
		appstore: false,
		calendar: false,
		// 'system-preferences': false,

		'purus-twitter': false,
		'view-source': true,
	} as Record<AppID, boolean>,

	minimized: {
		wallpapers: false,
		finder: false,
		vscode: false,
		calculator: false,
		// safari: false,
		appstore: false,
		calendar: false,
		// 'system-preferences': false,

		'purus-twitter': false,
		'view-source': false,
	} as Record<AppID, boolean>,

	minimized_previews: {} as Partial<Record<AppID, HTMLElement>>,
	minimized_rects: {} as Partial<Record<AppID, WindowRect>>,
	window_rects: {} as Partial<Record<AppID, WindowRect>>,

	active: 'finder' satisfies AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: {
		wallpapers: 0,
		finder: 0,
		vscode: 0,
		calculator: 0,
		// safari: 0,
		appstore: 0,
		calendar: 0,
		// 'system-preferences': 0,

		'purus-twitter': 0,
		'view-source': 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		wallpapers: false,
		finder: false,
		vscode: false,
		calculator: false,
		// safari: false,
		appstore: false,
		calendar: false,
		// 'system-preferences': false,

		'purus-twitter': false,
		'view-source': false,
	} as Record<AppID, boolean>,
});
