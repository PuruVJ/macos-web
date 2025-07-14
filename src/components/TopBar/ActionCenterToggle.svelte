<script lang="ts">
	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { click_outside, elevation, focus_outside } from '🍎/attachments';
	import { fade_out } from '🍎/helpers/fade';
	import { Toggleable } from '🍎/state/toggleable.svelte';
	import SwitchSvg from '../SVG/SwitchSVG.svelte';
	import ActionCenter from './ActionCenter.svelte';

	const visibility_toggle = new Toggleable(() => false);
</script>

<div
	class="container"
	{@attach click_outside(visibility_toggle.hide)}
	{@attach focus_outside(visibility_toggle.hide)}
>
	<button style:--scale={visibility_toggle.current ? '1 1' : 0} onclick={visibility_toggle.toggle}>
		<SwitchSvg />
	</button>

	{#if visibility_toggle.current}
		<div
			in:fade={{ easing: sineIn, duration: 150 }}
			out:fade_out
			class="menu-parent"
			{@attach elevation('menubar-menu-parent')}
		>
			<ActionCenter />
		</div>
	{/if}
</div>

<style>
	.container {
		height: 100%;

		padding: 0.25rem 0;
	}

	.container button {
		height: 100%;
		width: max-content;

		border-radius: 1rem;

		position: relative;
		z-index: 1;

		padding: 0 0.8rem;
		font-size: 0.8rem;

		&::before {
			content: '';

			position: absolute;
			top: 0;
			left: 0;

			pointer-events: none;

			height: 100%;
			width: 100%;

			border-radius: inherit;

			scale: var(--scale);
			transform-origin: center center;

			transition: transform 100ms ease;

			background-color: lch(100% 0 0 / 20%);
		}

		:global(svg),
		:global(svg path) {
			height: 0.9rem;
			width: 0.9rem;

			fill: white !important;

			position: relative;
		}
	}

	.menu-parent {
		z-index: 1;
		position: absolute;
		right: 1rem;
		margin-top: 7px;
	}
</style>
