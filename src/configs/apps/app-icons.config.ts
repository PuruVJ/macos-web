const app_icon_path_map: Record<string, string> = {
	wallpapers: '/app-icons/wallpapers/256.webp',
	finder: '/app-icons/finder/256.webp',
	vscode: '/app-icons/vscode/256.webp',
	calculator: '/app-icons/calculator/256.webp',
	appstore: '/app-icons/appstore/256.webp',
	calendar: '/app-icons/calendar/256.webp',
	'system-preferences': '/app-icons/system-preferences/256.webp',
	'purus-twitter': '/app-icons/purus-twitter/256.webp',
	'view-source': '/app-icons/view-source/256.webp',
	vercel: '/app-icons/vercel/256.webp',
};

export const get_app_icon_path = (app_id: string) =>
	app_icon_path_map[app_id] ?? app_icon_path_map.appstore;
