import { sineIn, sineOut } from 'svelte/easing';

export function fade_in(
	node: HTMLElement,
	{ duration = 150, delay = duration }: SvelteTransitionConfig = {},
): SvelteTransitionReturnType {
	const o = +getComputedStyle(node).opacity;

	return {
		duration: duration,
		delay,
		easing: sineIn,
		css: (t) => `opacity: ${t * o}`,
	};
}

export function fade_out(
	node: HTMLElement,
	{ duration = 150 }: SvelteTransitionConfig = {},
): SvelteTransitionReturnType {
	const o = +getComputedStyle(node).opacity;

	return {
		duration,
		easing: sineOut,
		css: (t) => `opacity: ${t * o}`,
	};
}
