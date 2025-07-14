import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import type { BaseSchema } from 'valibot';
import * as v from 'valibot';
import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';

export type Serde = {
	stringify: (value: any) => string;
	parse: (value: string) => any;
};

const default_serde: Serde = {
	stringify: (value) => JSON.stringify(value),
	parse: (value) => JSON.parse(value),
};

type ExtractValibotType<T extends BaseSchema<any, any, any>> = v.InferOutput<T>;

function get_value_from_storage(
	key: string,
	shape: BaseSchema<any, any, any>,
	serde = default_serde,
) {
	const value = localStorage.getItem(key);

	if (!value) return { found: false, value: null };

	try {
		return {
			found: true,
			value: v.parse(shape, serde.parse(value)),
		};
	} catch (e) {
		localStorage.removeItem(key);

		return {
			found: false,
			value: null,
		};
	}
}

export class Persisted<T extends BaseSchema<any, any, any>> {
	#current = $state<ExtractValibotType<T>>(undefined as ExtractValibotType<T>);
	#subscribe: () => void;
	#key: string;
	#debounce: number;
	#debounce_timer?: number;

	constructor(
		key: string,
		initial: ExtractValibotType<T>,
		shape: T,
		{ serde = default_serde, debounce = 0 }: { serde?: Serde; debounce?: number } = {},
	) {
		this.#current = initial;
		this.#key = key;
		this.#debounce = debounce;

		const val = get_value_from_storage(key, shape, serde);
		if (val.found) {
			this.#current = val.value;
		}

		// Create subscriber that only triggers for this specific key
		this.#subscribe = createSubscriber((update) => {
			return on(window, 'storage', (e: StorageEvent) => {
				if (e.key === this.#key) {
					const val = get_value_from_storage(this.#key, shape, serde);
					if (val.found) {
						this.#current = val.value;
						update();
					}
				}
			});
		});

		auto_destroy_effect_root(() => {
			let is_first_run = true;

			$effect(() => {
				this.#subscribe();

				const current = $state.snapshot(this.#current);
				if (!is_first_run) {
					if (this.#debounce > 0) {
						if (this.#debounce_timer) {
							clearTimeout(this.#debounce_timer);
						}
						this.#debounce_timer = setTimeout(() => {
							localStorage.setItem(key, serde.stringify(current));
						}, this.#debounce);
					} else {
						localStorage.setItem(key, serde.stringify(current));
					}
				}

				is_first_run = false;
			});

			// Cleanup debounce timer when effect is destroyed
			return () => {
				if (this.#debounce_timer) {
					clearTimeout(this.#debounce_timer);
				}
			};
		});
	}

	get current() {
		return this.#current;
	}

	set current(value: ExtractValibotType<T>) {
		this.#current = value;
	}
}
