import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess({
		replace: [['__DATE__', new Date().toISOString()]],
	}),
	compilerOptions: {
		cssHash: ({ hash, css }) => `s-${hash(css)}`,
	},
};
