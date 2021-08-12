/** Dispatch event on click outside of node */
export function focusOutside(node: HTMLElement, options: { callback: () => void }) {
  function handleFocus(e: FocusEvent) {
    const target = e.target as HTMLElement;

    if (!node?.contains(target)) options.callback();
  }

  document.addEventListener('focus', handleFocus, true);

  return {
    destroy() {
      document.removeEventListener('focus', handleFocus, true);
    },
  };
}
