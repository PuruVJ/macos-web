export class Toggleable {
	#getter: () => boolean = $state(() => false);
	#setter?: (value: boolean) => void = $state(() => {});

	#current = $derived(this.#getter());

	constructor(getter: () => boolean, setter?: (value: boolean) => void) {
		this.#getter = getter;
		this.#setter = setter;
	}

	static of(obj: { current: boolean }) {
		return new Toggleable(
			() => obj.current,
			(v) => (obj.current = v),
		);
	}

	get current() {
		return this.#current;
	}

	#set(value: boolean) {
		if (this.#setter) {
			this.#setter?.(value);
		} else {
			this.#current = value;
		}
	}

	toggle = () => {
		this.#set(!this.#current);
	};

	show = () => {
		this.#set(true);
	};

	hide = () => {
		this.#set(false);
	};
}
