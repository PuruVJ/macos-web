<script lang="ts">
	import { elevation } from '🍎/attachments';
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
			untrack(() => (is_dock_hidden.current = false));
			return;
		}

		if (!Object.values(apps.fullscreen).some(Boolean)) {
			untrack(() => (is_dock_hidden.current = false));
			return;
		}

		untrack(() => (is_dock_hidden.current = Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD));
	});
</script>

<svelte:body onmousemove={({ y }) => (mouseY = y)} />

<svelte:window bind:innerHeight={bodyHeight} />

<section
	class="dock-container"
	class:dock-hidden={is_dock_hidden.current}
	bind:this={dockContainerEl}
	{@attach elevation('dock')}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dock-el"
		class:hidden={is_dock_hidden.current}
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
		height: 5.8rem;

		padding: 0.4rem;

		display: flex;
		justify-content: center;

		&:not(.dock-hidden) {
			pointer-events: none;
		}
	}

	.dock-el {
		--border-size: 1px;

		background-color: lch(0% 0 0 / 10%);

		filter: drop-shadow(0 10px 60px rgba(0, 0, 0, 0.08)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.04))
			drop-shadow(0 1px 3px rgba(0, 0, 0, 0.02));

		box-shadow:
			inset var(--border-size) 0 0 0 lch(100% 0 0 / 20%),
			inset 0 calc(-1 * var(--border-size)) 0 0 lch(100% 0 0 / 30%),
			inset calc(-1 * var(--border-size)) 0 0 0 lch(100% 0 0 / 30%),
			inset 0 var(--border-size) 0 0 lch(100% 0 0 / 20%),
			0 20px 80px rgba(0, 0, 0, 0.08),
			0 8px 40px rgba(0, 0, 0, 0.05),
			0 2px 16px rgba(0, 0, 0, 0.03);

		position: relative;

		padding: 0.3rem;

		border-radius: 2rem;

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
			position: absolute;
			inset: 0;
			border-radius: inherit;
			background:
				linear-gradient(to right, transparent, lch(100% 0 0 / 0%)) left/100% 100%,
				linear-gradient(to top, transparent, lch(100% 0 0 / 0%)) bottom/100% 100%,
				linear-gradient(to left, transparent, lch(100% 0 0 / 0%)) right/100% 100%,
				linear-gradient(to bottom, transparent, lch(100% 0 0 / 0%)) top/100% 100%;
			pointer-events: none;
		}
	}

	.divider {
		height: 80%;
		width: 0.2px;

		translate: 0 -10%;

		background-color: lch(100% 0 0 / 30%);

		margin: 0 4px;
	}
</style>
