import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export function focus_outside(callback: () => void): Attachment<HTMLElement> {
	return (node) => {
		function handle_focus(e: FocusEvent) {
			const target = e.target as HTMLElement;

			if (!node?.contains(target)) callback();
		}

		return on(document, 'focus', handle_focus, { capture: true });
	};
}
