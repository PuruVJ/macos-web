<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { rand_int } from '🍎/helpers/random.ts';
	import { sleep } from '🍎/helpers/sleep';
	import { apps, type AppID, type WindowRect } from '🍎/state/apps.svelte.ts';
	import { is_dock_hidden } from '🍎/state/dock.svelte';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);
	let is_minimizing = $state(false);
	let window_width = $state<number>();
	let window_height = $state<number>();
	let resize_start:
		| {
				pointer_id: number;
				edge: string;
				x: number;
				y: number;
				width: number;
				height: number;
				left: number;
				top: number;
				min_x: number;
				min_y: number;
				max_x: number;
				max_y: number;
		  }
		| undefined;

	let windowEl = $state<HTMLElement>();

	const { height, width } = $derived(apps_config[app_id]);

	const remModifier = $derived(+height * 1.2 >= window.innerHeight ? 24 : 16);

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	let defaultPosition = {
		x: (document.body.clientWidth / 2 + randX) / 2,
		y: (100 + randY) / 2,
	};

	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));
	let was_minimized = false;

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	$effect(() => {
		if (apps.minimized[app_id]) {
			was_minimized = true;
			return;
		}

		if (was_minimized) {
			was_minimized = false;
			void restoreMinimizedWindow();
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function rectFrom(element: HTMLElement): WindowRect {
		const { left, top, width, height } = element.getBoundingClientRect();
		return { left, top, width, height };
	}

	function waitForFrame() {
		return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
	}

	async function animateWindowRect(
		baseRect: WindowRect,
		readTarget: () => WindowRect | undefined,
		duration: number,
		reverse = false,
	) {
		if (!windowEl || preferences.reduced_motion) return;

		const initialTarget = readTarget();
		if (!initialTarget) return;

		const from = reverse ? initialTarget : baseRect;
		const to = reverse ? baseRect : initialTarget;
		const startTime = performance.now();
		windowEl.style.transformOrigin = 'top left';
		windowEl.style.pointerEvents = 'none';

		await new Promise<void>((resolve) => {
			function step(now: number) {
				const progress = Math.min(1, (now - startTime) / duration);
				const eased = reverse ? 1 - (1 - progress) ** 3 : progress ** 3;
				const liveTarget = readTarget() ?? to;
				const endRect = reverse ? baseRect : liveTarget;
				const startRect = reverse ? liveTarget : baseRect;
				const left = startRect.left + (endRect.left - startRect.left) * eased;
				const top = startRect.top + (endRect.top - startRect.top) * eased;
				const width = startRect.width + (endRect.width - startRect.width) * eased;
				const height = startRect.height + (endRect.height - startRect.height) * eased;
				const pinch = (reverse ? 1 - eased : eased) * 100;
				const shoulder = 100 - pinch * 0.42;
				const lowerInset = pinch * 0.46;

				windowEl!.style.transform = `translate(${left - baseRect.left}px, ${top - baseRect.top}px) scale(${width / baseRect.width}, ${height / baseRect.height})`;
				windowEl!.style.borderRadius = `${12 - eased * 7}px`;
				windowEl!.style.clipPath = `polygon(0 0, 100% 0, 100% ${shoulder}%, ${50 + lowerInset}% 100%, ${50 - lowerInset}% 100%, 0 ${shoulder}%)`;

				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					resolve();
				}
			}

			requestAnimationFrame(step);
		});

		windowEl.style.transform = '';
		windowEl.style.transformOrigin = '';
		windowEl.style.borderRadius = '';
		windowEl.style.clipPath = '';
		windowEl.style.pointerEvents = '';
	}

	async function restoreMinimizedWindow() {
		if (!windowEl) return;
		const sourceRect = apps.minimized_rects[app_id];

		await waitForFrame();
		const windowRect = rectFrom(windowEl);
		if (sourceRect) {
			await animateWindowRect(windowRect, () => sourceRect, 420, true);
		}

		delete apps.minimized_previews[app_id];
		delete apps.minimized_rects[app_id];
		delete apps.window_rects[app_id];
	}

	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;

		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}

	async function maximizeApp() {
		if (!windowEl) return;

		if (!preferences.reduced_motion) {
			windowEl.style.transition = 'width 0.3s ease, height 0.3s ease, translate 0.3s ease';
		}

		if (!is_maximized) {
			dragging_enabled = false;

			// Save the current drag position before maximizing.
		} else {
			dragging_enabled = true;
		}

		is_maximized = !is_maximized;
		apps.fullscreen[app_id] = is_maximized;

		await sleep(300);

		if (!preferences.reduced_motion) {
			windowEl.style.transition = '';
		}
	}

	function closeApp() {
		apps.open[app_id] = false;
		apps.minimized[app_id] = false;
		apps.fullscreen[app_id] = false;
		delete apps.minimized_previews[app_id];
		delete apps.minimized_rects[app_id];
		delete apps.window_rects[app_id];
	}

	async function minimizeApp() {
		if (!windowEl || is_minimizing) return;

		is_minimizing = true;
		apps.minimized_previews[app_id] = windowEl;
		is_dock_hidden.value = false;

		await waitForFrame();
		await waitForFrame();

		const target = document.querySelector<HTMLElement>(
			`[data-minimized-window="${CSS.escape(app_id)}"]`,
		);
		const windowRect = rectFrom(windowEl);
		apps.window_rects[app_id] = windowRect;
		await animateWindowRect(
			windowRect,
			() => (target ? rectFrom(target) : undefined),
			560,
		);

		apps.minimized[app_id] = true;
		is_minimizing = false;
	}

	function startResize(event: PointerEvent) {
		if (!windowEl) return;

		event.preventDefault();
		event.stopPropagation();
		const rect = windowEl.getBoundingClientRect();
		const area = windowEl.parentElement?.getBoundingClientRect();
		const translate = getComputedStyle(windowEl).translate
			.split(' ')
			.map((value) => Number.parseFloat(value) || 0);
		resize_start = {
			pointer_id: event.pointerId,
			edge: (event.currentTarget as HTMLButtonElement).dataset.edge ?? 'se',
			x: event.clientX,
			y: event.clientY,
			width: rect.width,
			height: rect.height,
			left: rect.left - (area?.left ?? 0) - (translate[0] ?? 0),
			top: rect.top - (area?.top ?? 0) - (translate[1] ?? 0),
			min_x: area?.left ?? 0,
			min_y: area?.top ?? 0,
			max_x: area?.right ?? window.innerWidth,
			max_y: area?.bottom ?? window.innerHeight,
		};
		(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
	}

	function resizeWindow(event: PointerEvent) {
		if (!resize_start || resize_start.pointer_id !== event.pointerId) return;

		applyResize(
			resize_start.edge,
			event.clientX - resize_start.x,
			event.clientY - resize_start.y,
		);
	}

	function applyResize(edge: string, deltaX: number, deltaY: number) {
		if (!resize_start || !windowEl) return;

		const hasWest = edge.includes('w');
		const hasEast = edge.includes('e');
		const hasNorth = edge.includes('n');
		const hasSouth = edge.includes('s');
		const rect = windowEl.getBoundingClientRect();
		const maxWidth = hasWest
			? rect.right - resize_start.min_x
			: resize_start.max_x - rect.left;
		const maxHeight = hasNorth
			? rect.bottom - resize_start.min_y
			: resize_start.max_y - rect.top;

		if (hasWest || hasEast) {
			const proposedWidth = resize_start.width + (hasWest ? -deltaX : deltaX);
			window_width = Math.min(maxWidth, Math.max(260, proposedWidth));
		}
		if (hasNorth || hasSouth) {
			const proposedHeight = resize_start.height + (hasNorth ? -deltaY : deltaY);
			window_height = Math.min(maxHeight, Math.max(200, proposedHeight));
		}

		const widthDelta = resize_start.width - (window_width ?? resize_start.width);
		const heightDelta = resize_start.height - (window_height ?? resize_start.height);
		windowEl.style.left = `${resize_start.left + (hasWest ? widthDelta : 0)}px`;
		windowEl.style.top = `${resize_start.top + (hasNorth ? heightDelta : 0)}px`;
	}

	function endResize(event: PointerEvent) {
		if (!resize_start || resize_start.pointer_id !== event.pointerId) return;

		resize_start = undefined;
		const handle = event.currentTarget as HTMLButtonElement;
		if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
	}

	function resizeWithKeyboard(event: KeyboardEvent) {
		if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;

		event.preventDefault();
		event.stopPropagation();
		const step = event.shiftKey ? 40 : 10;
		const edge = (event.currentTarget as HTMLButtonElement).dataset.edge ?? 'se';
		const horizontalDelta =
			edge.includes('w') ? (event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0)
			: edge.includes('e') ? (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0)
			: 0;
		const verticalDelta =
			edge.includes('n') ? (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0)
			: edge.includes('s') ? (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)
			: 0;
		if (horizontalDelta || verticalDelta) {
			if (!resize_start && windowEl) {
				const rect = windowEl.getBoundingClientRect();
				const area = windowEl.parentElement?.getBoundingClientRect();
				const translate = getComputedStyle(windowEl).translate
					.split(' ')
					.map((value) => Number.parseFloat(value) || 0);
				resize_start = {
					pointer_id: -1,
					edge,
					x: 0,
					y: 0,
					width: rect.width,
					height: rect.height,
					left: rect.left - (area?.left ?? 0) - (translate[0] ?? 0),
					top: rect.top - (area?.top ?? 0) - (translate[1] ?? 0),
					min_x: area?.left ?? 0,
					min_y: area?.top ?? 0,
					max_x: area?.right ?? window.innerWidth,
					max_y: area?.bottom ?? window.innerHeight,
				};
			}
			applyResize(edge, horizontalDelta, verticalDelta);
			resize_start = undefined;
		}
	}

	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}

	onMount(() => windowEl?.focus());
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:maximized={is_maximized}
	class:minimizing={is_minimizing}
	hidden={apps.minimized[app_id]}
	style:width={is_maximized ? '100%' : `${window_width ?? (+width / remModifier) * 16}px`}
	style:height={is_maximized ? '100%' : `${window_height ?? (+height / remModifier) * 16}px`}
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(
			BoundsFrom.viewport({
				bottom: -6000,
				top: 27.2,
				left: -6000,
				right: -6000,
			}),
		),
		disabledComp,
		position({ default: defaultPosition }),
		events({
			onDragStart: onAppDragStart,
			onDragEnd: onAppDragEnd,
		}),
	])}
	onclick={focusApp}
	onkeydown={() => {}}
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights
			{app_id}
			on_maximize_click={maximizeApp}
			on_minimize_click={minimizeApp}
			on_close_app={closeApp}
		/>
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />

	{#if apps_config[app_id].resizable && !is_maximized}
		{#each ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as edge}
			<button
				type="button"
				class="resize-handle resize-{edge}"
				data-edge={edge}
				aria-label="Resize {apps_config[app_id].title} window from {edge}"
				title="Resize window"
				onpointerdown={startResize}
				onpointermove={resizeWindow}
				onpointerup={endResize}
				onpointercancel={endResize}
				onkeydown={resizeWithKeyboard}
				onclick={(event) => event.stopPropagation()}
			></button>
		{/each}
	{/if}
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height, transform;

		&[hidden] {
			display: none;
		}

		&.maximized {
			translate: 0px 0px !important;
		}

		&.minimizing {
			pointer-events: none;
		}

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;

		&.active {
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}
	}

	.tl-container {
		position: absolute;
		top: 1rem;
		left: 1rem;

		box-shadow: none !important;
	}

	.resize-handle {
		position: absolute;
		z-index: 12;
		padding: 0;
		border: 0;
		background: transparent;
		touch-action: none;

		&:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: -2px;
		}
	}

	.resize-n,
	.resize-s {
		right: 0.65rem;
		left: 0.65rem;
		height: 6px;
		cursor: ns-resize;
	}

	.resize-n {
		top: 0;
	}

	.resize-s {
		bottom: 0;
	}

	.resize-e,
	.resize-w {
		top: 0.65rem;
		bottom: 0.65rem;
		width: 6px;
		cursor: ew-resize;
	}

	.resize-e {
		right: 0;
	}

	.resize-w {
		left: 0;
	}

	.resize-ne,
	.resize-sw {
		cursor: nesw-resize;
	}

	.resize-nw,
	.resize-se {
		cursor: nwse-resize;
	}

	.resize-ne,
	.resize-nw,
	.resize-se,
	.resize-sw {
		width: 12px;
		height: 12px;
	}

	.resize-ne {
		top: 0;
		right: 0;
	}

	.resize-nw {
		top: 0;
		left: 0;
	}

	.resize-se {
		right: 0;
		bottom: 0;
	}

	.resize-sw {
		bottom: 0;
		left: 0;
	}
</style>
