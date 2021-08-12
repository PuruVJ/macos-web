/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, options: { callback: () => void }) {
  const handleClick = (e: MouseEvent) => {
    if (node && !node.contains(e.target as HTMLElement) && !e.defaultPrevented) {
      options.callback();
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}
