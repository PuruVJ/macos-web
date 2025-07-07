import { createSubscriber } from 'svelte/reactivity';

export class Interval {
	#duration = $state() as number;
	#subscribe: () => void;

	constructor(duration: number) {
		this.#duration = duration;

		this.#subscribe = createSubscriber((update) => {
			const interval = setInterval(() => {
				update();
			}, this.#duration);

			return () => clearInterval(interval);
		});
	}

	get current() {
		this.#subscribe();
		return new Date();
	}

	get duration() {
		return this.#duration;
	}
}
