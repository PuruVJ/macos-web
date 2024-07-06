import { tick } from 'svelte';

/**
 * Usage: <div use:portal={'css selector'}> or <div use:portal={document.body}>
 *
 * @param {HTMLElement} el
 * @param {HTMLElement|string} target DOM Element or CSS Selector
 */
export function portal(el: HTMLElement, target: HTMLElement | string = 'body') {
	let target_el: HTMLElement;

	async function update(new_target: HTMLElement | string) {
		target = new_target;

		if (typeof target === 'string') {
			target_el = document.querySelector(target);

			if (target_el === null) {
				await tick();
				target_el = document.querySelector(target);
			}

			if (target_el === null) {
				throw new Error(`No element found matching css selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			target_el = target;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					target === null ? 'null' : typeof target
				}. Allowed types: string (CSS selector) or HTMLElement.`,
			);
		}
		target_el.appendChild(el);
		el.hidden = false;
	}

	function destroy() {
		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}

	update(target);

	return {
		update,
		destroy,
	};
}
