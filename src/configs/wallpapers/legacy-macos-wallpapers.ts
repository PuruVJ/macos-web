import { wallpapers_config } from './wallpaper.config.ts';

const base = 'https://512pixels.net/downloads/macos-wallpapers';

export const legacy_macos_wallpapers = {
	'legacy-cheetah': { name: 'Mac OS X Cheetah 10.0', image: `${base}/10-0_10.1.png` },
	'legacy-puma': { name: 'Mac OS X Puma 10.1', image: `${base}/10-0_10.1.png` },
	'legacy-jaguar': { name: 'Mac OS X Jaguar 10.2', image: `${base}/10-2.png` },
	'legacy-panther': { name: 'Mac OS X Panther 10.3', image: `${base}/10-3.png` },
	'legacy-tiger': { name: 'Mac OS X Tiger 10.4', image: `${base}/10-4.png` },
	'legacy-leopard': { name: 'Mac OS X Leopard 10.5', image: `${base}/10-5.png` },
	'legacy-snow-leopard': { name: 'Mac OS X Snow Leopard 10.6', image: `${base}/10-6.png` },
	'legacy-lion': { name: 'Mac OS X Lion 10.7', image: `${base}/10-7.png` },
	'legacy-mountain-lion': { name: 'OS X Mountain Lion 10.8', image: `${base}/10-8.jpg` },
	'legacy-mavericks': { name: 'OS X Mavericks 10.9', image: `${base}/10-9.jpg` },
	'legacy-yosemite': { name: 'OS X Yosemite 10.10', image: `${base}/10-10.jpg` },
	'legacy-el-capitan': { name: 'OS X El Capitan 10.11', image: `${base}/10-11.jpg` },
	'legacy-sierra': { name: 'macOS Sierra 10.12', image: `${base}/10-12.jpg` },
	'legacy-high-sierra': { name: 'macOS High Sierra 10.13', image: `${base}/10-13.jpg` },
	'legacy-mojave-day': { name: 'macOS Mojave 10.14 — Day', image: `${base}/10-14-Day.jpg` },
	'legacy-mojave-night': { name: 'macOS Mojave 10.14 — Night', image: `${base}/10-14-Night.jpg` },
	'legacy-catalina-light': { name: 'macOS Catalina 10.15 — Light', image: `${base}/10-15-beta-light.jpg` },
	'legacy-catalina-dark': { name: 'macOS Catalina 10.15 — Dark', image: `${base}/10-15-beta-dark.jpg` },
} as const;

for (const [id, wallpaper] of Object.entries(legacy_macos_wallpapers)) {
	(wallpapers_config as Record<string, any>)[id] = {
		name: wallpaper.name,
		type: 'standalone',
		thumbnail: wallpaper.image,
		image: wallpaper.image,
	};
}
