import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';

type Primitive = string | null | symbol | boolean | number | undefined | bigint;

const is_primitive = (val: any): val is Primitive => {
	return val !== Object(val) || val === null;
};

export function persisted<T>(key: string, initial: T) {
	const existing = localStorage.getItem(key);

	const primitive = is_primitive(initial);
	const parsed_value = existing ? JSON.parse(existing) : initial;

	let state = $state<T extends Primitive ? { value: T } : T>(
		primitive ? { value: parsed_value } : parsed_value,
	);

	auto_destroy_effect_root(() => {
		$effect(() => {
			// @ts-ignore
			localStorage.setItem(key, JSON.stringify(primitive ? state.value : state));
		});
	});

	return state;
}
