import { apps_config } from './apps-config';
import { type AppConfig, create_app_config } from '🍎/helpers/create-app-config';
import { get_proxy_install_from_id, proxy_apps } from '🍎/state/proxy-apps.svelte';

const MAX_DOCK_APPS = 4;

const fallback_config = create_app_config({
	title: 'App',
});

export function get_runtime_app_ids(): string[] {
	const staticApps = Object.keys(apps_config);
	const proxyAppIds = proxy_apps.installs.map((app) => app.id);
	
	// Limit dock apps to MAX_DOCK_APPS (static apps first, then proxy apps)
	const allApps = [...staticApps, ...proxyAppIds];
	return allApps.slice(0, MAX_DOCK_APPS);
}

export function get_runtime_app_config(app_id: string): AppConfig {
	const config = (apps_config as Record<string, AppConfig>)[app_id];
	if (config) return config;

	const proxy_install = get_proxy_install_from_id(app_id);
	if (proxy_install) {
		return create_app_config({
			title: proxy_install.title,
			resizable: true,
			height: 640,
			width: 960,
		});
	}

	return fallback_config;
}

export function is_app_in_dock(app_id: string): boolean {
	return get_runtime_app_ids().includes(app_id);
}

export function get_dock_app_count(): number {
	return get_runtime_app_ids().length;
}

export function can_add_to_dock(): boolean {
	return get_dock_app_count() < MAX_DOCK_APPS;
}
