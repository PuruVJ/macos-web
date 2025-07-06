import type { Attachment } from 'svelte/attachments';

export const portal =
	(target: HTMLElement | string = 'body'): Attachment<HTMLElement> =>
	(node) => {
		const target_el = typeof target === 'string' ? document.querySelector(target) : target;

		if (target_el === null) {
			throw new Error(`No element found: "${target}"`);
		}

		target_el.appendChild(node);
		node.hidden = false;

		return () => target_el.removeChild(node);
	};
