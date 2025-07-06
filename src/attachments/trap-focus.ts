import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

// Global registry of active focus traps
let active_trap_elements: HTMLElement[] = [];

// Focus trap keyboard event handler
const handle_keydown = (event: KeyboardEvent): void => {
	if (event.target === window || event.key !== 'Tab') {
		return;
	}

	const target = event.target as Element;
	const trap_container = active_trap_elements.find((element) => element.contains(target));

	if (!trap_container) {
		return;
	}

	const focusable_elements = trap_container.querySelectorAll<HTMLElement>(
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',
	);

	if (focusable_elements.length === 0) {
		return;
	}

	const first_element = focusable_elements[0];
	const last_element = focusable_elements[focusable_elements.length - 1];
	const is_shift_tab = event.shiftKey;

	// Moving forward from last element - wrap to first
	if (!is_shift_tab && event.target === last_element) {
		event.preventDefault();
		first_element.focus();
	}
	// Moving backward from first element - wrap to last
	else if (is_shift_tab && event.target === first_element) {
		event.preventDefault();
		last_element.focus();
	}
};

// Initialize global event listener on first use
let listener: () => void;

/**
 * Svelte action to trap focus within an element
 *
 * Usage:
 * <div {@attach trap_focus}>
 *   <!-- focusable content -->
 * </div>
 */
export const trap_focus: Attachment<HTMLElement> = (node: HTMLElement) => {
	listener ??= on(document, 'keydown', handle_keydown);

	active_trap_elements.push(node);

	return () => {
		active_trap_elements = active_trap_elements.filter((element) => element !== node);

		if (active_trap_elements.length === 0 && listener) {
			listener();
		}
	};
};
