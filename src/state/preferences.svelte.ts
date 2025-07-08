import { MediaQuery } from 'svelte/reactivity';
import * as v from 'valibot';
import { COLORS } from '🍎/configs/colors.ts';
import { wallpapers_config, type WallpaperID } from '🍎/configs/wallpapers/wallpaper.config';
import { smaller_closest_value } from '🍎/helpers/smaller-closest-value';
import { Interval } from './interval.svelte';
import { Persisted } from './persisted.svelte';

const theme_schema = v.object({
	current: v.picklist(['light', 'dark']),
	preference: v.picklist(['system', 'light', 'dark']),
	accent_color: v.picklist(COLORS),
});
const wallpaper_schema = v.object({
	id: v.picklist(Object.keys(wallpapers_config)),
});

const reduced_motion_schema = v.object({
	preference: v.picklist(['system', 'true', 'false']),
	current: v.boolean(),
});

export type ReducedMotionType = v.InferOutput<typeof reduced_motion_schema>;
export type ThemeValue = v.InferOutput<typeof theme_schema>;

class Theme {
	#media_observer = new MediaQuery('prefers-color-scheme: dark');
	#persisted = new Persisted(
		'macos:theme',
		{
			current: 'light',
			preference: 'system',
			accent_color: 'blue',
		},
		theme_schema,
	);

	get scheme() {
		this.#media_observer.current;

		const current_scheme =
			this.#persisted.current.preference === 'system'
				? this.#media_observer.current
					? 'dark'
					: 'light'
				: this.#persisted.current.preference;

		document.body.dataset.theme = current_scheme;

		return current_scheme;
	}

	get preference() {
		return this.#persisted.current.preference;
	}

	set preference(value: ThemeValue['preference']) {
		this.#persisted.current.preference = value;

		if (value !== 'system') {
			this.#persisted.current.current = value;
		}

		// Trigger document body change
		this.scheme;
	}

	get accent() {
		this.#apply(this.#persisted.current.accent_color);

		return this.#persisted.current.accent_color;
	}

	set accent(value: ThemeValue['accent_color']) {
		this.#persisted.current.accent_color = value;
		this.accent;
	}

	#apply(value: ThemeValue['accent_color']) {
		document.body.dataset.accent = value;
	}
}

export class Wallpaper {
	#persisted: Persisted<typeof wallpaper_schema>;
	#interval = new Interval(5 * 1000);

	static metadata = wallpapers_config;

	constructor(id: WallpaperID) {
		this.#persisted = new Persisted('macos:wallpaper', { id }, wallpaper_schema);
	}

	get config() {
		return Wallpaper.metadata[this.#persisted.current.id];
	}

	get image() {
		// Depends on the interval
		this.#interval.current;

		let value = this.config.image;

		const date = new Date();
		const hour = date.getHours();
		const id = this.#persisted.current.id;

		const wallpaper_timestamps_map = wallpapers_config[id].timestamps.wallpaper;
		const timestamps = Object.keys(wallpaper_timestamps_map);

		const min_timestamp = Math.min(...timestamps);
		const max_timestamp = Math.max(...timestamps);

		if (hour > max_timestamp || hour < min_timestamp) {
			value = wallpaper_timestamps_map[max_timestamp] || value;
		} else {
			const chosen_time_stamp = smaller_closest_value(timestamps, hour);

			if (wallpaper_timestamps_map[chosen_time_stamp]) {
				value = wallpaper_timestamps_map[chosen_time_stamp];
			}
		}

		return value;
	}

	get id() {
		return this.#persisted.current.id;
	}

	set id(value: WallpaperID) {
		this.#persisted.current.id = value;
	}
}

class ReducedMotion {
	#system: MediaQuery;
	#persisted: Persisted<typeof reduced_motion_schema>;

	#current = $derived.by(() => {
		this.#system.current;

		return this.#persisted.current.preference === 'system'
			? this.#system.current
			: this.#persisted.current.preference === 'true';
	});

	constructor() {
		this.#system = new MediaQuery('(prefers-reduced-motion)');
		this.#persisted = new Persisted(
			'macos:reduced-motion',
			{
				preference: 'system',
				current: this.#system.current,
			},
			reduced_motion_schema,
		);
	}

	get preference() {
		return this.#persisted.current.preference;
	}

	set preference(value: ReducedMotionType['preference']) {
		this.#persisted.current.preference = value;
	}

	get current() {
		return this.#current;
	}
}

export const theme = new Theme();
export const reduced_motion = new ReducedMotion();
export const wallpaper = new Wallpaper('tahoe');
