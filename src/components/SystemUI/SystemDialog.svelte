<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { click_outside, elevation, portal, trapFocus } from '🍎/actions';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

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
		{ duration = preferences.reduced_motion ? 0 : 250 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		return {
			duration,
			easing: sineInOut,
			css: (t) => `transform: scale(${t})`,
		};
	}
</script>

{#if is_open}
	<section class="overlay" use:portal={'#windows-area'} use:elevation={'system-dialog'}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="dialog"
			class:dark={preferences.theme.scheme === 'dark'}
			tabindex={0}
			role="dialog"
			aria-labelledby="info-title"
			aria-describedby="info-description"
			in:dialog_open_transition
			out:fade_out
			use:trapFocus
			use:click_outside={() => backdrop_dismiss && close()}
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

		background: hsla(var(--system-color-light-hsl), 0.6);
		backdrop-filter: blur(20px);

		will-change: transform;

		border-radius: 1rem;
		box-shadow: var(--elevation);

		&.dark {
			/* // border-radius: inherit; */
			box-shadow:
				var(--elevation),
				inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1px hsla(var(--system-color-light-hsl), 0.5);
		}
	}
</style>
