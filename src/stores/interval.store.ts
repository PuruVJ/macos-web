import { readable } from 'svelte/store';

export const createIntervalStore = (duration: number) =>
  readable(new Date(), (setTime) => {
    let interval = setInterval(() => setTime(new Date()), duration);

    return () => clearInterval(interval);
  });
