import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import type { BaseSchema } from 'valibot';
import * as v from 'valibot';

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
	#subscribe: () => void;
	#key: string;
	#update?: () => void;
	#intial: ExtractValibotType<T>;
	#shape: T;
	#serde: Serde = default_serde;

	constructor(key: string, initial: ExtractValibotType<T>, shape: T, serde = default_serde) {
		this.#key = key;
		this.#intial = initial;
		this.#shape = shape;
		this.#serde = serde;

		this.#subscribe = createSubscriber((update) => {
			this.#update = update;

			const cleanup = on(window, 'storage', (e: StorageEvent) => {
				if (e.key === this.#key) {
					update();
				}
			});

			return () => {
				cleanup();
				this.#update = undefined;
			};
		});
	}

	get current() {
		this.#subscribe?.();

		const val = get_value_from_storage(this.#key, this.#shape, this.#serde);
		if (val.found) {
			if (val.value != null && typeof val.value === 'object') {
				return proxy(val.value, val.value, this.#key, this.#update);
			}
		}

		if (typeof this.#intial === 'object') {
			return proxy(this.#intial, this.#intial, this.#key, this.#update);
		}

		return this.#intial;
	}

	set current(value: ExtractValibotType<T>) {
		localStorage.setItem(this.#key, this.#serde.stringify(value));
		this.#update?.();
	}
}

function proxy<T extends object>(value: T, root: any, root_key: string, update: () => void) {
	return new Proxy(value, {
		get(target, key) {
			const val = Reflect.get(target, key);
			if (val != null && typeof val === 'object') {
				return proxy(val, root, root_key, update);
			}
			return val;
		},

		set(target, key, value) {
			Reflect.set(target, key, value);

			localStorage.setItem(root_key, JSON.stringify(root));
			update();
			return true;
		},
	});
}
