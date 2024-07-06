/** Dispatch event on click outside of node */
export function click_outside(node: HTMLElement, callback: () => void) {
	const handleClick = (e: MouseEvent) => {
		if (!node.contains(e.target as HTMLElement)) callback();
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
	};
}
