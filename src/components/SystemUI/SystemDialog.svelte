<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { click_outside, elevation, portal, trap_focus } from '🍎/attachments';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { reduced_motion, theme } from '🍎/state/preferences.svelte.ts';

	const {
		backdrop_dismiss = true,
		on_close,
		on_open,
		children,
	}: {
		backdrop_dismiss?: boolean;
		on_open?: () => void;
		on_close?: (message: string) => void;
		children: Snippet<[]>;
	} = $props();

	let is_open = $state<boolean>();

	export function open() {
		is_open = true;
		on_open();
	}

	export function close(message?: string) {
		is_open = false;

		on_close(message);

		return message;
	}

	function dialog_open_transition(
		_: HTMLElement,
		{ duration = reduced_motion.current ? 0 : 250 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		return {
			duration,
			easing: sineInOut,
			css: (t) => `transform: scale(${t})`,
		};
	}
</script>

{#if is_open}
	<section class="overlay" {@attach portal('#windows-area')} {@attach elevation('system-dialog')}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="dialog"
			class:dark={theme.scheme === 'dark'}
			tabindex={0}
			role="dialog"
			aria-labelledby="info-title"
			aria-describedby="info-description"
			in:dialog_open_transition
			out:fade_out
			{@attach trap_focus}
			{@attach click_outside(() => backdrop_dismiss && close())}
			onclick={(e) => e.stopPropagation()}
		>
			{@render children?.()}
		</div>
	</section>
{/if}

<style>
	.overlay {
		position: sticky;
		top: 0;
		left: 0;

		height: 100%;
		width: 100%;

		display: grid;
		place-items: center;
	}

	.dialog {
		--elevation: 0px 2.7px 10.4px rgba(0, 0, 0, 0.124), 0px 6.5px 25px rgba(0, 0, 0, 0.178),
			0px 12.3px 47.1px rgba(0, 0, 0, 0.22), 0px 21.9px 84px rgba(0, 0, 0, 0.262),
			0px 40.9px 157.1px rgba(0, 0, 0, 0.316), 0px 98px 376px rgba(0, 0, 0, 0.44);

		padding: 1rem;

		background: lch(from var(--system-color-light) l c h / 60%);
		backdrop-filter: blur(20px);

		will-change: transform;

		border-radius: 1rem;
		box-shadow: var(--elevation);

		&.dark {
			/* // border-radius: inherit; */
			box-shadow:
				var(--elevation),
				inset 0 0 0 0.9px lch(from var(--system-color-dark) l c h / 30%),
				0 0 0 1px lch(from var(--system-color-light) l c h / 50%);
		}
	}
</style>
