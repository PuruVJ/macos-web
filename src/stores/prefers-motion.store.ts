import { writable } from 'svelte/store';

export const prefersReducedMotion = writable(matchMedia('(prefers-reduced-motion)').matches);

let initialized = false;
prefersReducedMotion.subscribe((val) => {
  const localVal = JSON.parse(localStorage.getItem('reduced-motion'));

  if (localVal !== null && !initialized) {
    prefersReducedMotion.set(localVal);
    val = localVal;
    initialized = true;
  }

  localStorage.setItem('reduced-motion', val + '');
});
