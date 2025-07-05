<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import {
		displacement_map,
		polar_displacement_map,
		prominent_displacement_map,
	} from '🍎/helpers/liquid-glass.ts';

	type displacement_mode = 'standard' | 'polar' | 'prominent';

	interface liquid_glass_props {
		children: Snippet;
		displacement_scale?: number;
		blur_amount?: number;
		saturation?: number;
		aberration_intensity?: number;
		elasticity?: number;
		corner_radius?: number;
		global_mouse_pos?: { x: number; y: number };
		mouse_offset?: { x: number; y: number };
		mouse_container?: HTMLElement | null;
		class?: string;
		padding?: string;
		style?: string;
		over_light?: boolean;
		mode?: displacement_mode;
		onclick?: () => void;
	}

	interface glass_size {
		width: number;
		height: number;
	}

	interface mouse_position {
		x: number;
		y: number;
	}

	// Props with defaults
	let {
		children,
		displacement_scale = 70,
		blur_amount = 0.0625,
		saturation = 140,
		aberration_intensity = 2,
		elasticity = 0.15,
		corner_radius = 999,
		global_mouse_pos: external_global_mouse_pos,
		mouse_offset: external_mouse_offset,
		mouse_container = null,
		class: class_name = '',
		padding = '24px 32px',
		over_light = false,
		style = '',
		mode = 'standard' as displacement_mode,
		onclick,
	}: liquid_glass_props = $props();

	const get_map = (mode: displacement_mode): string => {
		switch (mode) {
			case 'standard':
				return displacement_map;
			case 'polar':
				return polar_displacement_map;
			case 'prominent':
				return prominent_displacement_map;
			default:
				throw new Error(`Invalid mode: ${mode}`);
		}
	};

	// State variables
	let glass_ref: HTMLDivElement;
	let is_hovered = $state(false);
	let is_active = $state(false);
	let glass_size = $state<glass_size>({ width: 270, height: 69 });
	let internal_global_mouse_pos = $state<mouse_position>({ x: 0, y: 0 });
	let internal_mouse_offset = $state<mouse_position>({ x: 0, y: 0 });
	let filter_id = $state(`glass-filter-${Math.random().toString(36).substr(2, 9)}`);

	// Use external mouse position if provided, otherwise use internal
	const global_mouse_pos = $derived(external_global_mouse_pos || internal_global_mouse_pos);
	const mouse_offset = $derived(external_mouse_offset || internal_mouse_offset);

	const is_firefox = $derived(
		typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox'),
	);

	// Internal mouse tracking
	const handle_mouse_move = (e: MouseEvent): void => {
		const container = mouse_container || glass_ref;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const center_x = rect.left + rect.width / 2;
		const center_y = rect.top + rect.height / 2;

		internal_mouse_offset = {
			x: ((e.clientX - center_x) / rect.width) * 100,
			y: ((e.clientY - center_y) / rect.height) * 100,
		};

		internal_global_mouse_pos = {
			x: e.clientX,
			y: e.clientY,
		};
	};

	// Calculate directional scaling based on mouse position
	const calculate_directional_scale = (): string => {
		if (!global_mouse_pos.x || !global_mouse_pos.y || !glass_ref) {
			return 'scale(1)';
		}

		const rect = glass_ref.getBoundingClientRect();
		const pill_center_x = rect.left + rect.width / 2;
		const pill_center_y = rect.top + rect.height / 2;
		const pill_width = glass_size.width;
		const pill_height = glass_size.height;

		const delta_x = global_mouse_pos.x - pill_center_x;
		const delta_y = global_mouse_pos.y - pill_center_y;

		// Calculate distance from mouse to pill edges (not center)
		const edge_distance_x = Math.max(0, Math.abs(delta_x) - pill_width / 2);
		const edge_distance_y = Math.max(0, Math.abs(delta_y) - pill_height / 2);
		const edge_distance = Math.sqrt(
			edge_distance_x * edge_distance_x + edge_distance_y * edge_distance_y,
		);

		// Activation zone: 200px from edges
		const activation_zone = 200;

		// If outside activation zone, no effect
		if (edge_distance > activation_zone) {
			return 'scale(1)';
		}

		// Calculate fade-in factor (1 at edge, 0 at activation zone boundary)
		const fade_in_factor = 1 - edge_distance / activation_zone;

		// Normalize the deltas for direction
		const center_distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
		if (center_distance === 0) {
			return 'scale(1)';
		}

		const normalized_x = delta_x / center_distance;
		const normalized_y = delta_y / center_distance;

		// Calculate stretch factors with fade-in
		const stretch_intensity = Math.min(center_distance / 300, 1) * elasticity * fade_in_factor;

		// X-axis scaling: stretch horizontally when moving left/right, compress when moving up/down
		const scale_x =
			1 +
			Math.abs(normalized_x) * stretch_intensity * 0.3 -
			Math.abs(normalized_y) * stretch_intensity * 0.15;

		// Y-axis scaling: stretch vertically when moving up/down, compress when moving left/right
		const scale_y =
			1 +
			Math.abs(normalized_y) * stretch_intensity * 0.3 -
			Math.abs(normalized_x) * stretch_intensity * 0.15;

		return `scaleX(${Math.max(0.8, scale_x)}) scaleY(${Math.max(0.8, scale_y)})`;
	};

	// Helper function to calculate fade-in factor based on distance from element edges
	const calculate_fade_in_factor = (): number => {
		if (!global_mouse_pos.x || !global_mouse_pos.y || !glass_ref) {
			return 0;
		}

		const rect = glass_ref.getBoundingClientRect();
		const pill_center_x = rect.left + rect.width / 2;
		const pill_center_y = rect.top + rect.height / 2;
		const pill_width = glass_size.width;
		const pill_height = glass_size.height;

		const edge_distance_x = Math.max(
			0,
			Math.abs(global_mouse_pos.x - pill_center_x) - pill_width / 2,
		);
		const edge_distance_y = Math.max(
			0,
			Math.abs(global_mouse_pos.y - pill_center_y) - pill_height / 2,
		);
		const edge_distance = Math.sqrt(
			edge_distance_x * edge_distance_x + edge_distance_y * edge_distance_y,
		);

		const activation_zone = 200;
		return edge_distance > activation_zone ? 0 : 1 - edge_distance / activation_zone;
	};

	// Helper function to calculate elastic translation
	const calculate_elastic_translation = (): mouse_position => {
		if (!glass_ref) {
			return { x: 0, y: 0 };
		}

		const fade_in_factor = calculate_fade_in_factor();
		const rect = glass_ref.getBoundingClientRect();
		const pill_center_x = rect.left + rect.width / 2;
		const pill_center_y = rect.top + rect.height / 2;

		return {
			x: (global_mouse_pos.x - pill_center_x) * elasticity * 0.1 * fade_in_factor,
			y: (global_mouse_pos.y - pill_center_y) * elasticity * 0.1 * fade_in_factor,
		};
	};

	const transform_style = $derived(() => {
		const translation = calculate_elastic_translation();
		const scale = is_active && onclick ? 'scale(0.96)' : calculate_directional_scale();
		return `translate(calc(-50% + ${translation.x}px), calc(-50% + ${translation.y}px)) ${scale}`;
	});

	const backdrop_filter_style = $derived(
		`blur(${(over_light ? 12 : 4) + blur_amount * 32}px) saturate(${saturation}%)`,
	);

	// Update glass size whenever component mounts or window resizes
	const update_glass_size = (): void => {
		if (glass_ref) {
			const rect = glass_ref.getBoundingClientRect();
			glass_size = { width: rect.width, height: rect.height };
		}
	};

	onMount(() => {
		// Set up mouse tracking if no external mouse position is provided
		if (!external_global_mouse_pos && !external_mouse_offset) {
			const container = mouse_container || glass_ref;
			if (container) {
				container.addEventListener('mousemove', handle_mouse_move);
			}
		}

		update_glass_size();
		window.addEventListener('resize', update_glass_size);

		return () => {
			const container = mouse_container || glass_ref;
			if (container) {
				container.removeEventListener('mousemove', handle_mouse_move);
			}
		};
	});

	onDestroy(() => {
		window.removeEventListener('resize', update_glass_size);
	});

	// Event handlers
	const handle_mouse_enter = (): void => {
		is_hovered = true;
	};

	const handle_mouse_leave = (): void => {
		is_hovered = false;
	};

	const handle_mouse_down = (): void => {
		is_active = true;
	};

	const handle_mouse_up = (): void => {
		is_active = false;
	};
</script>

{#snippet glass_filter(props: {
	id: string;
	displacement_scale: number;
	aberration_intensity: number;
	width: number;
	height: number;
	mode: displacement_mode;
})}
	<svg
		class="filter-svg"
		style:width="{props.width}px"
		style:height="{props.height}px"
		aria-hidden="true"
	>
		<defs>
			<radialGradient id="{props.id}-edge-mask" cx="50%" cy="50%" r="50%">
				<stop offset="0%" stop-color="black" stop-opacity="0" />
				<stop
					offset="{Math.max(30, 80 - props.aberration_intensity * 2)}%"
					stop-color="black"
					stop-opacity="0"
				/>
				<stop offset="100%" stop-color="white" stop-opacity="1" />
			</radialGradient>
			<filter
				id={props.id}
				x="-35%"
				y="-35%"
				width="170%"
				height="170%"
				color-interpolation-filters="sRGB"
			>
				<feImage
					id="feimage"
					x="0"
					y="0"
					width="100%"
					height="100%"
					result="DISPLACEMENT_MAP"
					href={get_map(props.mode)}
					preserveAspectRatio="xMidYMid slice"
				/>

				<!-- Create edge mask using the displacement map itself -->
				<feColorMatrix
					in="DISPLACEMENT_MAP"
					type="matrix"
					values="0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0 0 0 1 0"
					result="EDGE_INTENSITY"
				/>
				<feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
					<feFuncA type="discrete" tableValues="0 {props.aberration_intensity * 0.05} 1" />
				</feComponentTransfer>

				<!-- Original undisplaced image for center -->
				<feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

				<!-- Red channel displacement with slight offset -->
				<feDisplacementMap
					in="SourceGraphic"
					in2="DISPLACEMENT_MAP"
					scale={props.displacement_scale * -1}
					xChannelSelector="R"
					yChannelSelector="B"
					result="RED_DISPLACED"
				/>
				<feColorMatrix
					in="RED_DISPLACED"
					type="matrix"
					values="1 0 0 0 0
                 0 0 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
					result="RED_CHANNEL"
				/>

				<!-- Green channel displacement -->
				<feDisplacementMap
					in="SourceGraphic"
					in2="DISPLACEMENT_MAP"
					scale={props.displacement_scale * (-1 - props.aberration_intensity * 0.05)}
					xChannelSelector="R"
					yChannelSelector="B"
					result="GREEN_DISPLACED"
				/>
				<feColorMatrix
					in="GREEN_DISPLACED"
					type="matrix"
					values="0 0 0 0 0
                 0 1 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
					result="GREEN_CHANNEL"
				/>

				<!-- Blue channel displacement with slight offset -->
				<feDisplacementMap
					in="SourceGraphic"
					in2="DISPLACEMENT_MAP"
					scale={props.displacement_scale * (-1 - props.aberration_intensity * 0.1)}
					xChannelSelector="R"
					yChannelSelector="B"
					result="BLUE_DISPLACED"
				/>
				<feColorMatrix
					in="BLUE_DISPLACED"
					type="matrix"
					values="0 0 0 0 0
                 0 0 0 0 0
                 0 0 1 0 0
                 0 0 0 1 0"
					result="BLUE_CHANNEL"
				/>

				<!-- Combine all channels with screen blend mode for chromatic aberration -->
				<feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
				<feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />

				<!-- Add slight blur to soften the aberration effect -->
				<feGaussianBlur
					in="RGB_COMBINED"
					stdDeviation={Math.max(0.1, 0.5 - props.aberration_intensity * 0.1)}
					result="ABERRATED_BLURRED"
				/>

				<!-- Apply edge mask to aberration effect -->
				<feComposite
					in="ABERRATED_BLURRED"
					in2="EDGE_MASK"
					operator="in"
					result="EDGE_ABERRATION"
				/>

				<!-- Create inverted mask for center -->
				<feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
					<feFuncA type="table" tableValues="1 0" />
				</feComponentTransfer>
				<feComposite in="CENTER_ORIGINAL" in2="INVERTED_MASK" operator="in" result="CENTER_CLEAN" />

				<!-- Combine edge aberration with clean center -->
				<feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
			</filter>
		</defs>
	</svg>
{/snippet}

{#snippet glass_container(props: {
	children: Snippet;
	class?: string;
	style?: string;
	displacement_scale: number;
	blur_amount: number;
	saturation: number;
	aberration_intensity: number;
	mouse_offset: mouse_position;
	on_mouse_enter?: () => void;
	on_mouse_leave?: () => void;
	on_mouse_down?: () => void;
	on_mouse_up?: () => void;
	active: boolean;
	over_light: boolean;
	corner_radius: number;
	padding: string;
	glass_size: glass_size;
	onclick?: () => void;
	mode: displacement_mode;
	filter_id: string;
})}
	<div
		bind:this={glass_ref}
		class="glass-container {props.class || ''} {props.active ? 'active' : ''} {props.onclick
			? 'clickable'
			: ''}"
		style={props.style || ''}
		onclick={props.onclick}
	>
		{@render glass_filter({
			mode: props.mode,
			id: props.filter_id,
			displacement_scale: props.displacement_scale,
			aberration_intensity: props.aberration_intensity,
			width: props.glass_size.width,
			height: props.glass_size.height,
		})}

		<div
			class="glass"
			style:border-radius="{props.corner_radius}px"
			style:padding={props.padding}
			style:box-shadow={props.over_light
				? '0px 16px 70px rgba(0, 0, 0, 0.75)'
				: '0px 12px 40px rgba(0, 0, 0, 0.25)'}
			onmouseenter={props.on_mouse_enter}
			onmouseleave={props.on_mouse_leave}
			onmousedown={props.on_mouse_down}
			onmouseup={props.on_mouse_up}
		>
			<!-- backdrop layer that gets wiggly -->
			<span
				class="glass-warp"
				style:filter={is_firefox ? 'none' : `url(#${props.filter_id})`}
				style:backdrop-filter={backdrop_filter_style}
			></span>

			<!-- user content stays sharp -->
			<div
				class="glass-content"
				style:text-shadow={props.over_light
					? '0px 2px 12px rgba(0, 0, 0, 0)'
					: '0px 2px 12px rgba(0, 0, 0, 0.4)'}
			>
				{@render props.children()}
			</div>
		</div>
	</div>
{/snippet}

<div class={['liquid-glass-wrapper', class_name]} {style}>
	<!-- Over light effect -->
	<div
		class="over-light-effect"
		class:visible={over_light}
		style:height="{glass_size.height}px"
		style:width="{glass_size.width}px"
		style:border-radius="{corner_radius}px"
		style:transform={transform_style()}
	></div>

	<div
		class="over-light-overlay"
		class:visible={over_light}
		style:height="{glass_size.height}px"
		style:width="{glass_size.width}px"
		style:border-radius="{corner_radius}px"
		style:transform={transform_style()}
	></div>

	{@render glass_container({
		children,
		class: '',
		style: '',
		corner_radius,
		displacement_scale: over_light ? displacement_scale * 0.5 : displacement_scale,
		blur_amount,
		saturation,
		aberration_intensity,
		glass_size,
		padding,
		mouse_offset,
		on_mouse_enter: handle_mouse_enter,
		on_mouse_leave: handle_mouse_leave,
		on_mouse_down: handle_mouse_down,
		on_mouse_up: handle_mouse_up,
		active: is_active,
		over_light,
		onclick,
		mode,
		filter_id,
	})}

	<!-- Border layer 1 - extracted from glass container -->
	<span
		class="border-layer-1"
		style:height="{glass_size.height}px"
		style:width="{glass_size.width}px"
		style:border-radius="{corner_radius}px"
		style:transform={transform_style()}
		style:background="linear-gradient(
		{135 + mouse_offset.x * 1.2}deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, {0.12 +
			Math.abs(mouse_offset.x) * 0.008}) {Math.max(10, 33 + mouse_offset.y * 0.3)}%, rgba(255, 255,
		255, {0.4 + Math.abs(mouse_offset.x) * 0.012}) {Math.min(90, 66 + mouse_offset.y * 0.4)}%,
		rgba(255, 255, 255, 0.0) 100% )"
	></span>

	<!-- Border layer 2 - duplicate with mix-blend-overlay -->
	<span
		class="border-layer-2"
		style:height="{glass_size.height}px"
		style:width="{glass_size.width}px"
		style:border-radius="{corner_radius}px"
		style:transform={transform_style()}
		style:background="linear-gradient(
		{135 + mouse_offset.x * 1.2}deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, {0.32 +
			Math.abs(mouse_offset.x) * 0.008}) {Math.max(10, 33 + mouse_offset.y * 0.3)}%, rgba(255, 255,
		255, {0.6 + Math.abs(mouse_offset.x) * 0.012}) {Math.min(90, 66 + mouse_offset.y * 0.4)}%,
		rgba(255, 255, 255, 0.0) 100% )"
	></span>

	<!-- Hover effects -->
	{#if onclick}
		<div
			class="hover-effect-1"
			class:hovered={is_hovered || is_active}
			style:height="{glass_size.height}px"
			style:width="{glass_size.width + 1}px"
			style:border-radius="{corner_radius}px"
			style:transform={transform_style()}
		></div>

		<div
			class="hover-effect-2"
			class:active={is_active}
			style:height="{glass_size.height}px"
			style:width="{glass_size.width + 1}px"
			style:border-radius="{corner_radius}px"
			style:transform={transform_style()}
		></div>

		<div
			class="hover-effect-3"
			class:hovered={is_hovered}
			class:active={is_active}
			style:height="{glass_size.height}px"
			style:width="{glass_size.width + 1}px"
			style:border-radius="{corner_radius}px"
			style:transform={transform_style()}
		></div>
	{/if}
</div>

<style>
	.liquid-glass-wrapper {
		position: relative;
		display: inline-block;
	}

	.filter-svg {
		position: absolute;
	}

	.glass-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all ease-out 0.2s;
	}

	.glass-container.clickable {
		cursor: pointer;
	}

	.glass {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 24px;
		overflow: hidden;
		transition: all 0.2s ease-in-out;
	}

	.glass-warp {
		position: absolute;
		inset: 0;
	}

	.glass-content {
		position: relative;
		z-index: 1;
		font: 500 20px/1 system-ui;
		color: white;
		transition: all 150ms ease-in-out;
	}

	.over-light-effect {
		background-color: black;
		transition: all 150ms ease-in-out;
		pointer-events: none;
		position: absolute;
		top: 50%;
		left: 50%;
		opacity: 0;
	}

	.over-light-effect.visible {
		opacity: 0.2;
	}

	.over-light-overlay {
		background-color: black;
		transition: all 150ms ease-in-out;
		pointer-events: none;
		mix-blend-mode: overlay;
		position: absolute;
		top: 50%;
		left: 50%;
		opacity: 0;
	}

	.over-light-overlay.visible {
		opacity: 1;
	}

	.border-layer-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		transition: all ease-out 0.2s;
		pointer-events: none;
		mix-blend-mode: screen;
		opacity: 0.2;
		padding: 1.5px;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.5) inset,
			0 1px 3px rgba(255, 255, 255, 0.25) inset,
			0 1px 4px rgba(0, 0, 0, 0.35);
	}

	.border-layer-2 {
		position: absolute;
		top: 50%;
		left: 50%;
		transition: all ease-out 0.2s;
		pointer-events: none;
		mix-blend-mode: overlay;
		padding: 1.5px;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.5) inset,
			0 1px 3px rgba(255, 255, 255, 0.25) inset,
			0 1px 4px rgba(0, 0, 0, 0.35);
	}

	.hover-effect-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
		transition: all 0.2s ease-out;
		opacity: 0;
		background-image: radial-gradient(
			circle at 50% 0%,
			rgba(255, 255, 255, 0.5) 0%,
			rgba(255, 255, 255, 0) 50%
		);
		mix-blend-mode: overlay;
	}

	.hover-effect-1.hovered {
		opacity: 0.5;
	}

	.hover-effect-2 {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
		transition: all 0.2s ease-out;
		opacity: 0;
		background-image: radial-gradient(
			circle at 50% 0%,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0) 80%
		);
		mix-blend-mode: overlay;
	}

	.hover-effect-2.active {
		opacity: 0.5;
	}

	.hover-effect-3 {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
		transition: all 0.2s ease-out;
		opacity: 0;
		background-image: radial-gradient(
			circle at 50% 0%,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0) 100%
		);
		mix-blend-mode: overlay;
	}

	.hover-effect-3.hovered {
		opacity: 0.4;
	}

	.hover-effect-3.active {
		opacity: 0.8;
	}
</style>
