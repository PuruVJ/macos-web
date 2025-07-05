import { create_app_config } from '🍎/helpers/create-app-config.ts';

const wallpapers = create_app_config({
	title: 'Wallpapers',
	resizable: true,

	height: 600,
	width: 800,

	dock_breaks_before: true,
});

const calculator = create_app_config({
	title: 'Calculator',

	expandable: true,
	resizable: false,

	height: 250 * 1.414,
	width: 250,
});

const calendar = create_app_config({
	title: 'Calendar',
	resizable: true,
});

const vscode = create_app_config({
	title: 'VSCode',
	resizable: true,

	height: 600,
	width: 800,
});

const finder = create_app_config({
	title: 'Finder',
	resizable: true,

	// dockBreaksBefore: true,
	should_open_window: false,
});

const safari = create_app_config({
	title: 'Safari',
	resizable: true,
});

const systemPreferences = create_app_config({
	title: 'System Preferences',
	resizable: true,
});

const purusTwitter = create_app_config({
	title: `About the Developer`,
	resizable: true,

	dock_breaks_before: true,

	height: 600,
	width: 800,
});

const viewSource = create_app_config({
	title: `View Source`,
	resizable: true,

	should_open_window: false,
	external_action: () => window.open('https://github.com/puruvj/macos-web', '_blank'),
});

const appstore = create_app_config({
	title: 'App Store',
	resizable: true,
});

export const apps_config = {
	finder,
	wallpapers,
	calculator,
	calendar,
	vscode,
	appstore,
	// safari,

	// 'system-preferences': systemPreferences,

	'purus-twitter': purusTwitter,
	'view-source': viewSource,
};
