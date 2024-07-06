<svelte:options runes={true} />

<script lang="ts">
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import { is_dock_hidden } from '🍎/state/dock.svelte';
	import DockItem from './DockItem.svelte';
	import { untrack } from 'svelte';

	let dock_mouse_x = $state<number | null>(null);

	const HIDDEN_DOCK_THRESHOLD = 30;
	let bodyHeight = $state(0);
	let mouseY = $state(0);

	let dockContainerEl = $state<HTMLElement>();

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
		onmousemove={(event) => (dock_mouse_x = event.x)}
		onmouseleave={() => (dock_mouse_x = null)}
	>
		{#each Object.entries(apps_config) as [appID, config]}
			{#if config.dock_breaks_before}
				<div class="divider" aria-hidden="true"></div>
			{/if}

			<DockItem mouse_x={dock_mouse_x} app_id={appID} needs_update={system_needs_update.value} />
		{/each}
	</div>
</section>

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

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 0 4px;
	}
</style>
