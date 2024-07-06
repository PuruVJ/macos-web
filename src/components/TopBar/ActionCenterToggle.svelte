<script lang="ts">
	import { untrack } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { click_outside, elevation, focus_outside } from '🍎/actions';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { apps } from '🍎/state/apps.svelte.ts';
	import SwitchSvg from '../SVG/SwitchSVG.svelte';
	import SystemDialog from '../SystemUI/SystemDialog.svelte';
	import ActionCenter from './ActionCenter.svelte';

	let visible = $state(false);
	let theme_warning_dialog: SystemDialog;

	/* LOGIC FOR THEME SWITCHING WHEN IT ISN'T ALLOWED */
	let is_theme_warning_dialog_open = $state(false);

	$effect(() => {
		if (is_theme_warning_dialog_open) {
			untrack(() => theme_warning_dialog.open());
		}
	});

	function show() {
		visible = true;
	}

	function hide() {
		visible = false;
	}
</script>

<div class="container" use:click_outside={hide} use:focus_outside={hide}>
	<button style:--scale={visible ? 1 : 0} onclick={show} onfocus={show}>
		<SwitchSvg />
	</button>

	{#if visible}
		<div
			in:fade={{ easing: sineIn, duration: 150 }}
			out:fade_out
			class="menu-parent"
			use:elevation={'menubar-menu-parent'}
		>
			<ActionCenter bind:is_theme_warning_dialog_open />
		</div>
	{/if}
</div>

<SystemDialog
	bind:this={theme_warning_dialog}
	on_close={() => (is_theme_warning_dialog_open = false)}
>
	<section class="theme-warning-section">
		<img height="100" width="100" src="/app-icons/wallpapers/256.webp" alt="Wallpapers app logo" />

		<h3>Current Wallpaper Settings prevent changing theme</h3>
		<p>Head over to Wallpapers app to change this setting or choose a standalone wallpaper.</p>

		<div class="buttons">
			<button onclick={() => theme_warning_dialog.close()}>Close</button>
			<button
				class="confirm"
				onclick={() => {
					theme_warning_dialog.close();

					apps.open.wallpapers = true;
					apps.active = 'wallpapers';
				}}
			>
				Go to Wallpapers
			</button>
		</div>
	</section>
</SystemDialog>

<style>
	.container button {
		height: 100%;
		width: max-content;

		padding: 0 0.5rem !important;

		border-radius: 0.25rem;

		position: relative;

		&::before {
			content: '';

			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			height: 100%;
			width: 100%;

			border-radius: inherit;

			transform: scale(var(--scale));
			transform-origin: center center;

			transition: transform 100ms ease;

			background-color: hsla(0, 0%, 96%, 0.3);
		}

		:global(svg),
		:global(svg path) {
			height: 1rem;
			width: 1rem;

			fill: var(--system-color-light-contrast) !important;

			position: relative;
		}
	}

	.menu-parent {
		z-index: 1;
		position: absolute;
		right: 1rem;
		margin-top: 7px;
	}

	.theme-warning-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		padding: 1rem 0 0;

		width: 20rem;

		color: var(--system-color-dark);

		h3,
		p {
			text-align: center;
		}

		h3 {
			font-size: 1.2rem;
			font-weight: 500;
		}

		p {
			font-size: 0.9rem;
		}

		.buttons {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;

			width: 100%;

			button {
				width: 100%;
				height: 2rem;

				font-weight: 500;

				border-radius: 0.5rem;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.3);
				}

				&.confirm {
					background-color: var(--system-color-primary);

					color: var(--system-color-primary-contrast);

					&:hover {
						background-color: hsla(var(--system-color-primary-hsl), 0.8);
					}
				}
			}
		}
	}
</style>
