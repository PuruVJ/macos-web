<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [-distanceLimit, -distanceLimit / 1.25, -distanceLimit / 2, 0, distanceLimit / 2, distanceLimit / 1.25, distanceLimit];
	const widthOutput = [baseWidth, baseWidth * 1.1, baseWidth * 1.414, baseWidth * 2, baseWidth * 1.414, baseWidth * 1.1, baseWidth];
</script>

<script lang="ts">
	import { interpolate } from 'popmotion';
	import { onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { mouse_x, app_id, needs_update = false }: { mouse_x: number | null; app_id: AppID; needs_update?: boolean } = $props();
	let icon_el = $state<HTMLElement>();
	let distance = $state(beyond_the_distance_limit);
	const width_px = spring(baseWidth, { damping: 0.47, stiffness: 0.12 });
	const get_width_from_distance = interpolate(distanceInput, widthOutput);
	$effect(() => { distance; untrack(() => ($width_px = get_width_from_distance(distance))); });

	let raf: number;
	function animate() {
		if (icon_el && mouse_x !== null) {
			const rect = icon_el.getBoundingClientRect();
			distance = mouse_x - (rect.left + rect.width / 2);
			return;
		}
		distance = beyond_the_distance_limit;
	}
	$effect(() => {
		mouse_x;
		if (preferences.reduced_motion || apps.is_being_dragged) return;
		raf = requestAnimationFrame(animate);
	});

	const { title = app_id } = $derived(apps_config[app_id]);
	const openWindow = $derived(apps_config[app_id]?.should_open_window !== false);
	const externalAction = $derived(apps_config[app_id]?.external_action);
	const iconSrc = $derived(`${import.meta.env.BASE_URL}app-icons/${app_id}/256.png`);
	const appOpenIconBounceTransform = tweened(0, { duration: 400, easing: sineInOut });

	async function bounceEffect() {
		await appOpenIconBounceTransform.set(-40);
		appOpenIconBounceTransform.set(0);
	}

	async function openApp(e: MouseEvent) {
		if (!openWindow) {
			if (externalAction) await externalAction(e);
			return;
		}
		const isAppAlreadyOpen = apps.open[app_id];
		apps.open[app_id] = true;
		apps.active = app_id;
		if (!isAppAlreadyOpen) bounceEffect();
	}

	onDestroy(() => cancelAnimationFrame(raf));
	const is_app_store = $derived(app_id === 'appstore');
	const show_pwa_badge = $derived(is_app_store && needs_update);
	$effect(() => { if (show_pwa_badge) bounceEffect(); });
</script>

<button onclick={openApp} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p class="tooltip" class:tooltip-enabled={!apps.is_being_dragged} class:dark={preferences.theme.scheme === 'dark'} use:elevation={'dock-tooltip'}>{title}</p>
	<span bind:this={icon_el} class="icon-shell" style:width="{$width_px / 16}rem" style:height="{$width_px / 16}rem" style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		<img src={iconSrc} alt="" draggable="false" loading="eager" decoding="async" />
	</span>
	<div class="dot" style:--opacity={+apps.open[app_id]}></div>
	{#if show_pwa_badge}<div class="pwa-badge">1</div>{/if}
</button>

<style>
	button {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
		border-radius: .7rem;
		padding: 0;
		background: transparent;
		border: 0;
		box-shadow: none;
	}

	.icon-shell {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		box-shadow: none;
		filter: none;
		flex: none;
		border-radius: 18px;
		overflow: hidden;
	}

	.icon-shell img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		flex: none;
		user-select: none;
		-webkit-user-drag: none;
	}

	button:hover .tooltip-enabled, button:focus-visible .tooltip-enabled { display: block; }
	.tooltip {
		white-space: nowrap;
		position: absolute;
		bottom: 3.65rem;
		left: 50%;
		transform: translateX(-50%);
		background: color-mix(in srgb, var(--system-color-light) 58%, transparent);
		backdrop-filter: blur(8px);
		padding: .5rem .75rem;
		border-radius: .375rem;
		box-shadow: 0 1px 5px 2px rgba(0,0,0,.3);
		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-size: .85rem;
		letter-spacing: .2px;
		display: none;
	}
	.tooltip.dark { color: var(--system-color-dark); }
	.dot { height: 4px; width: 4px; margin: 0; border-radius: 50%; background: var(--system-color-dark); opacity: var(--opacity); }
	.pwa-badge { position: absolute; top: 0; right: -2px; background: #f83a3a; border-radius: 50%; width: 1.25rem; height: 1.25rem; text-align: center; color: #fff; font-size: .8rem; line-height: 1.25rem; }
</style>
