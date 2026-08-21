import Safari from '🍎/components/apps/Safari/Safari.svelte';

export const apps_config = {
	finder: { id: 'finder', title: 'Finder', icon: 'finder', disabled: false, faded: false, showInDock: true, showInAppStore: false, should_open_window: true, height: 560, width: 860 },
	safari: { id: 'safari', title: 'Safari', icon: 'safari', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 620, width: 980, component: Safari },
	calculator: { id: 'calculator', title: 'Calculator', icon: 'calculator', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 430, width: 330 },
	calendar: { id: 'calendar', title: 'Calendar', icon: 'calendar', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 620, width: 860 },
	notes: { id: 'notes', title: 'Notes', icon: 'notes', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 620, width: 760 },
	terminal: { id: 'terminal', title: 'Terminal', icon: 'terminal', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 520, width: 780 },
	'system-preferences': { id: 'system-preferences', title: 'System Settings', icon: 'system-preferences', disabled: false, faded: false, showInDock: true, showInAppStore: false, should_open_window: true, height: 620, width: 780 },
	wallpapers: { id: 'wallpapers', title: 'Wallpapers', icon: 'wallpapers', disabled: false, faded: false, showInDock: true, showInAppStore: false, should_open_window: true, height: 680, width: 980 },
	vscode: { id: 'vscode', title: 'VS Code', icon: 'vscode', disabled: false, faded: false, showInDock: true, showInAppStore: true, should_open_window: true, height: 650, width: 1000 },
	appstore: { id: 'appstore', title: 'App Store', icon: 'appstore', disabled: false, faded: false, showInDock: true, showInAppStore: false, should_open_window: true, height: 600, width: 820 },
};

export const appsConfig = apps_config;
export const apps = apps_config;
export default apps_config;
