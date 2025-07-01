import { RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T>, callback: () => void) {
  const cachedCallback = useRef(() => {});

  useEffect(() => {
    cachedCallback.current = callback;
  });

  function handleClick(e: MouseEvent) {
    if (!ref.current?.contains(e.target as Node)) cachedCallback.current?.();
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}
