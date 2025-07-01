import { useEffect, useRef } from 'preact/hooks';

export const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallback = useRef<Function>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (!delay) return;

    const interval = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(interval);
  }, [delay]);
};
