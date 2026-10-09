<svelte:options runes={true} />

<script lang="ts">
	import { interpolate } from 'popmotion';
	import { untrack } from 'svelte';
	import { spring } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import { is_dock_hidden } from '🍎/state/dock.svelte';
	import DockItem from './DockItem.svelte';
	import DockWindow from './DockWindow.svelte';
	import Launchpad from './Launchpad.svelte';
	import { preferences } from '🍎/state/preferences.svelte';
	import type { AppID } from '🍎/state/apps.svelte';

	const minimized_group_anchor = Object.entries(apps_config)
		.filter(([, config]) => config.dock_breaks_before)
		.at(-1)?.[0];

	let dock_mouse_x = $state<number | null>(null);
	let launchpad_open = $state(false);
	let launchpad_image_el = $state<HTMLImageElement>();
	const launchpad_width_px = spring(57.6, { damping: 0.47, stiffness: 0.12 });
	const launchpad_distance_input = [-345.6, -276.48, -172.8, 0, 172.8, 276.48, 345.6];
	const launchpad_width_output = [57.6, 63.36, 81.4464, 115.2, 81.4464, 63.36, 57.6];
	const get_launchpad_width = interpolate(launchpad_distance_input, launchpad_width_output);

	const HIDDEN_DOCK_THRESHOLD = 30;
	let bodyHeight = $state(0);
	let mouseY = $state(0);

	let dockContainerEl = $state<HTMLElement>();

	function updateDockMouse(mouse_x: number | null) {
		dock_mouse_x = mouse_x;
		if (!launchpad_image_el || mouse_x === null || apps.is_being_dragged) {
			$launchpad_width_px = 57.6;
			return;
		}

		const rect = launchpad_image_el.getBoundingClientRect();
		const distance = mouse_x - (rect.left + rect.width / 2);
		$launchpad_width_px = preferences.reduced_motion ? 57.6 : get_launchpad_width(distance);
	}

	$effect(() => {
		// Due to how pointer-events: none works, if dock auto opens, you move away, it won't close automatically.
		// So close it manually if mouse pointer goes out of the dock area.
		if (Math.abs(mouseY - bodyHeight) > dockContainerEl?.clientHeight) {
			untrack(() => (dock_mouse_x = null));
		}

		/**
		 * if mouseX != null then show the dock. No matter what
		 * When it becomes null, Then use the mouseY and bodyHeight to determine if the dock should be hidden
		 */
		if (dock_mouse_x !== null) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		if (!Object.values(apps.fullscreen).some(Boolean)) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		untrack(() => (is_dock_hidden.value = Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD));
	});
</script>

<svelte:body onmousemove={({ y }) => (mouseY = y)} />

<svelte:window bind:innerHeight={bodyHeight} />

<section
	class="dock-container"
	class:dock-hidden={is_dock_hidden.value}
	bind:this={dockContainerEl}
	use:elevation={'dock'}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dock-el"
		class:hidden={is_dock_hidden.value}
		onmousemove={(event) => updateDockMouse(event.x)}
		onmouseleave={() => updateDockMouse(null)}
	>
		<button
			class="launchpad-button"
			class:active={launchpad_open}
			aria-label={launchpad_open ? 'Close Launchpad' : 'Open Launchpad'}
			title="Launchpad"
			style:width="{$launchpad_width_px / 16}rem"
			onclick={() => (launchpad_open = !launchpad_open)}
		>
			<img
				bind:this={launchpad_image_el}
				src="/app-icons/launchpad/256.png"
				alt=""
				draggable="false"
			/>
		</button>

		{#each Object.entries(apps_config) as [appID, config]}
			{#if config.dock_breaks_before}
				<div class="divider" aria-hidden="true"></div>
				{#if appID === minimized_group_anchor && Object.keys(apps.minimized_previews).length}
					{#each Object.keys(apps.minimized_previews) as minimizedID (minimizedID)}
						<DockWindow app_id={minimizedID as AppID} />
					{/each}
					<div class="divider" aria-hidden="true"></div>
				{/if}
			{/if}

			<DockItem mouse_x={dock_mouse_x} app_id={appID} needs_update={system_needs_update.value} />
		{/each}
	</div>
</section>

{#if launchpad_open}
	<Launchpad on_close={() => (launchpad_open = false)} />
{/if}

<style>
	.dock-container {
		padding-bottom: 0.7rem;
		left: 0;
		bottom: 0;

		width: 100%;
		height: 5.2rem;

		padding: 0.4rem;

		display: flex;
		justify-content: center;

		&:not(.dock-hidden) {
			pointer-events: none;
		}
	}

	.dock-el {
		background-color: hsla(var(--system-color-light-hsl), 0.4);

		box-shadow:
			inset 0 0 0 0.2px hsla(var(--system-color-grey-100-hsl), 0.7),
			0 0 0 0.2px hsla(var(--system-color-grey-900-hsl), 0.7),
			hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

		position: relative;

		padding: 0.3rem;

		border-radius: 1.2rem;

		height: 100%;

		display: flex;
		align-items: flex-end;

		transition: transform 0.3s ease;

		&:not(.hidden) {
			pointer-events: auto;
		}

		&.hidden {
			transform: translate3d(0, 200%, 0);

			&::before {
				width: calc(100% - 2px);
				height: calc(100% - 2px);

				margin-top: 1px;
				margin-left: 1px;
			}
		}

		&::before {
			content: '';

			border-radius: 20px;

			width: 100%;
			height: 100%;

			border: inherit;

			backdrop-filter: blur(10px);

			position: absolute;
			top: 0;
			left: 0;

			z-index: -1;
		}
	}

	.divider {
		height: 100%;
		width: 0.2px;
		flex: 0 0 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 0 4px;
	}

	.launchpad-button {
		flex: 0 0 auto;
		width: 3.6rem;
		aspect-ratio: 1;
		margin: 0 0.3rem;
		border-radius: 0.7rem;
		transition: transform 150ms ease;

		&:hover,
		&.active {
			transform: translateY(-0.2rem);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
</style>
