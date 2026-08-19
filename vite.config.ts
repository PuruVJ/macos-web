import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

import { prefetch } from './prefetch-plugin';

export default defineConfig({
	base: process.env.BASE_PATH ?? '/',
	plugins: [
		svelte(),
		prefetch(),
		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		imagetools(),
	],
	resolve: {
		alias: {
			'🍎': new URL('./src/', import.meta.url).pathname,
		},
	},
});
