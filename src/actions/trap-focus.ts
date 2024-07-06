let trapFocusList: HTMLElement[] = [];

const is_next = (event: KeyboardEvent) => event.key === 'Tab' && !event.shiftKey;
const is_previous = (event: KeyboardEvent) => event.key === 'Tab' && event.shiftKey;
const trap_focus_listener = (event: KeyboardEvent) => {
	if (event.target === window) {
		return;
	}

	const event_target = event.target as Element;

	const parent_node = trapFocusList.find((node) => node.contains(event_target));
	if (!parent_node) {
		return;
	}

	const focusable = parent_node.querySelectorAll<HTMLElement>(
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',
	);
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (is_next(event) && event.target === last) {
		event.preventDefault();
		first.focus();
	} else if (is_previous(event) && event.target === first) {
		event.preventDefault();
		last.focus();
	}
};

document.addEventListener('keydown', trap_focus_listener);

export const trap_focus = (node: HTMLElement) => {
	trapFocusList.push(node);
	return {
		destroy() {
			trapFocusList = trapFocusList.filter((element) => element !== node);
		},
	};
};
