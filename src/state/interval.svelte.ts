import { readable } from 'svelte/store';

export function create_interval(duration: number) {
  return readable(new Date(), (setTime) => {
    let interval = setInterval(() => setTime(new Date()), duration);

    return () => clearInterval(interval);
  });
}
