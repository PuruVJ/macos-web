import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export function click_outside(callback: () => void): Attachment<HTMLElement> {
	return (node) => {
		const handleClick = (e: MouseEvent) => {
			if (!node.contains(e.target as HTMLElement)) callback();
		};

		return on(document, 'click', handleClick, { capture: true });
	};
}
