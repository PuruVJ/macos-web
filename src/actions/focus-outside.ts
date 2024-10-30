/** Dispatch event on click outside of node */
export function focus_outside(node: HTMLElement, callback: () => void) {
	function handleFocus(e: FocusEvent) {
		const target = e.target as HTMLElement;

		if (!node?.contains(target)) callback();
	}

	document.addEventListener('focus', handleFocus, true);

	return {
		destroy() {
			document.removeEventListener('focus', handleFocus, true);
		},
	};
}
