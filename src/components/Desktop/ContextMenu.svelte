<script lang="ts">
	import { elevation } from '🍎/actions';
	import { context_menu_config } from '🍎/configs/menu/context.menu.config.ts';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { target_element }: { target_element: HTMLElement } = $props();

	let x_pos = $state(0);
	let y_pos = $state(0);
	let is_menu_visible = $state(false);

	function handle_context_menu(e: MouseEvent) {
		if (!target_element?.contains(e.target as HTMLElement)) return (is_menu_visible = false);

		let x = e.pageX;
		let y = e.pageY;

		// Open to other side if rest of space is too small
		if (window.innerWidth - x < 250) x -= 250;
		if (window.innerHeight - y < 300) y -= 250;

		x_pos = x;
		y_pos = y;

		is_menu_visible = true;
	}

	function hideMenu() {
		is_menu_visible = false;
	}
</script>

<svelte:body
	oncontextmenu={(e) => {
		e.preventDefault();
		handle_context_menu(e);
	}}
	onclick={hideMenu}
/>

{#if is_menu_visible}
	<div
		class="container"
		class:dark={preferences.theme.scheme === 'dark'}
		style:transform="translate({x_pos}px, {y_pos}px)"
		out:fade_out
		use:elevation={'context-menu'}
	>
		{#each Object.values(context_menu_config.default) as contents}
			<button class="menu-item">{contents.title}</button>

			{#if contents.breakAfter}
				<div class="divider"></div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.container {
		--additional-shadow: 0 0 0 0 white;
		display: block;

		min-width: 16rem;

		padding: 0.5rem;

		position: fixed;
		top: 0;
		left: 0;

		-webkit-font-smoothing: antialiased;
		user-select: none;

		background-color: hsla(var(--system-color-light-hsl), 0.3);

		border-radius: 0.5rem;

		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px,
			var(--additional-shadow);

		&.dark {
			--additional-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);

			&::before {
				transform: scale(0.99);
			}
		}

		&::before {
			content: '';

			width: 100%;
			height: 100%;

			border-radius: inherit;

			position: absolute;
			left: 0;
			top: 0;

			transform: scale(0.996);

			z-index: -1;
			backdrop-filter: blur(15px);
		}

		* {
			-webkit-font-smoothing: antialiased;
		}
	}

	.menu-item {
		--alpha: 1;

		display: flex;
		justify-content: flex-start;

		width: 100%;

		padding: 0.3rem 0.4rem;
		margin: 0.2rem 0;

		letter-spacing: 0.4px;
		font-weight: 400;
		font-size: 0.9rem;

		border-radius: 0.3rem;

		backface-visibility: hidden;
		transition: none;

		color: hsla(var(--system-color-dark-hsl), var(--alpha));

		&:hover,
		&:focus-visible {
			background-color: var(--system-color-primary);
			color: var(--system-color-primary-contrast);
		}
	}

	.divider {
		width: 100%;
		height: 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.2);

		margin: 2px 0;
	}
</style>
