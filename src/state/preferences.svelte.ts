import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
import { persisted } from './persisted.svelte.ts';
import { COLORS } from '🍎/configs/colors.ts';

export type WallpaperSettings = {
	id: WallpaperID;
	image: string;
	canControlTheme: boolean;
};

export type Theme = {
	scheme: 'light' | 'dark';
	primaryColor: (typeof COLORS)[number];
};

export const preferences = persisted('macos:preferences', {
	reduced_motion: matchMedia('(prefers-reduced-motion)').matches,
	theme: {
		scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primaryColor: 'blue',
	} as Theme,
	wallpaper: {
		image: 'tahoe-2',
		id: 'tahoe',
		canControlTheme: true,
	} as WallpaperSettings,
});

$effect.root(() => {
	$effect(() => {
		// Color scheme
		const { classList } = document.body;
		classList.remove('light', 'dark');
		classList.add(preferences.theme.scheme);

		// Primary color
		document.body.style.setProperty(
			'--system-color-primary',
			`var(--system-color-accent-color-${preferences.theme.primaryColor})`,
		);
	});
});
