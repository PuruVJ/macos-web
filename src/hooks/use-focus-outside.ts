import { RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export const useFocusOutside = <T extends HTMLElement>(ref: RefObject<T>, callback: () => void) => {
  const cachedCallback = useRef(() => {});

  useEffect(() => {
    cachedCallback.current = callback;
  });

  function handleFocus(e: FocusEvent) {
    const target = e.target as HTMLElement;

    if (!ref.current?.contains(target)) cachedCallback.current?.();
  }

  useEffect(() => {
    document.addEventListener('focus', handleFocus, true);

    return () => document.removeEventListener('focus', handleFocus);
  }, []);
};
