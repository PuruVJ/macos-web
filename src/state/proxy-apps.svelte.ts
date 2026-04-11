export type ProxyInstall = {
	id: string;
	title: string;
	target_url: string;
};

export const PROXY_INSTALL_KEY = 'macos:proxy-installs';
export const PROXY_APP_PREFIX = 'proxy:';

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function create_proxy_id(title: string, target_url: string): string {
	const title_slug = slugify(title);
	const host_slug = (() => {
		try {
			return slugify(new URL(target_url).hostname);
		} catch {
			return 'site';
		}
	})();

	return `${PROXY_APP_PREFIX}${title_slug || host_slug || 'app'}`;
}

function normalize_install(install: Omit<ProxyInstall, 'id'> & { id?: string }): ProxyInstall {
	return {
		...install,
		id: install.id || create_proxy_id(install.title, install.target_url),
	};
}

export const proxy_apps = $state({
	installs: [] as ProxyInstall[],
	loaded: false,
});

export function load_proxy_installs() {
	if (proxy_apps.loaded || typeof window === 'undefined') return;

	const saved_installs_raw = localStorage.getItem(PROXY_INSTALL_KEY);
	const saved_installs = saved_installs_raw
		? ((JSON.parse(saved_installs_raw) as Array<Omit<ProxyInstall, 'id'> & { id?: string }>).map(
				normalize_install,
			) as ProxyInstall[])
		: [];

	proxy_apps.installs = saved_installs;
	proxy_apps.loaded = true;
}

export function save_proxy_installs() {
	if (typeof window === 'undefined') return;
	localStorage.setItem(PROXY_INSTALL_KEY, JSON.stringify(proxy_apps.installs));
}

export function add_proxy_install(install: Omit<ProxyInstall, 'id'>) {
	const normalized = normalize_install(install);
	const exists = proxy_apps.installs.some(
		(app) => app.id === normalized.id || app.title === normalized.title || app.target_url === normalized.target_url,
	);

	if (exists) return;

	proxy_apps.installs = [...proxy_apps.installs, normalized];
	save_proxy_installs();
}

export function is_proxy_app_id(app_id: string): boolean {
	return app_id.startsWith(PROXY_APP_PREFIX);
}

export function get_proxy_install_from_id(app_id: string): ProxyInstall | undefined {
	return proxy_apps.installs.find((app) => app.id === app_id);
}
