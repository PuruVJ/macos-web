import { untrack } from 'svelte';
import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';

export function create_interval(duration: number) {
	let time = $state(Date.now());

	auto_destroy_effect_root(() => {
		$effect(() => {
			const interval = setInterval(() => {
				untrack(() => (time = Date.now()));
			}, duration);

			return () => {
				clearInterval(interval);
			};
		});
	});

	return {
		get value() {
			return time;
		},
	};
}
