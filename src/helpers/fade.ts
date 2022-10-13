import { sineIn, sineOut } from 'svelte/easing';

export function fadeIn(
  _: HTMLElement,
  { duration = 150, delay = duration }: SvelteTransitionConfig = {},
): SvelteTransitionReturnType {
  return {
    duration: duration + 10,
    delay,
    easing: sineIn,
    css: (t) => `opacity: ${t}`,
  };
}

export function fadeOut(
  _: HTMLElement,
  { duration = 150 }: SvelteTransitionConfig = {},
): SvelteTransitionReturnType {
  return {
    duration,
    easing: sineOut,
    css: (t) => `opacity: ${t}`,
  };
}
