<script lang="ts">
	interface Props {
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		onValueChange?: (value: number) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(100),
		onValueChange,
		disabled = false,
		class: className = '',
	}: Props = $props();

	let sliderRef: HTMLDivElement;
	let isDragging = $state(false);
	let trackWidth = $state(0);

	// Calculate percentage from value
	const percentage = $derived(() => {
		return ((value - min) / (max - min)) * 100;
	});

	// Calculate thumb position to keep it within track bounds
	const thumbLeft = $derived(() => {
		if (!trackWidth) return '50%';

		const thumbWidth = 16; // Updated to match new thumb size
		const maxLeft = trackWidth - thumbWidth;
		const left = (percentage() / 100) * maxLeft + thumbWidth / 2;

		return `${(left / trackWidth) * 100}%`;
	});

	// Get value from pointer position
	function getValueFromPointer(clientX: number): number {
		if (!sliderRef) return value;

		const rect = sliderRef.getBoundingClientRect();
		const relativeX = clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, relativeX / rect.width));

		const rawValue = min + percentage * (max - min);

		// Apply step rounding
		const steppedValue = Math.round(rawValue / step) * step;

		// Ensure within bounds
		return Math.max(min, Math.min(max, steppedValue));
	}

	function updateValue(newValue: number) {
		if (newValue !== value) {
			value = newValue;
			onValueChange?.(newValue);
		}
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;

		e.preventDefault();
		sliderRef.setPointerCapture(e.pointerId);
		isDragging = true;

		const newValue = getValueFromPointer(e.clientX);
		updateValue(newValue);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || disabled) return;

		e.preventDefault();
		const newValue = getValueFromPointer(e.clientX);
		updateValue(newValue);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;

		sliderRef.releasePointerCapture(e.pointerId);
		isDragging = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		let newValue = value;

		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				e.preventDefault();
				newValue = Math.max(min, value - step);
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				e.preventDefault();
				newValue = Math.min(max, value + step);
				break;
			case 'Home':
				e.preventDefault();
				newValue = min;
				break;
			case 'End':
				e.preventDefault();
				newValue = max;
				break;
			case 'PageDown':
				e.preventDefault();
				newValue = Math.max(min, value - step * 10);
				break;
			case 'PageUp':
				e.preventDefault();
				newValue = Math.min(max, value + step * 10);
				break;
		}

		updateValue(newValue);
	}

	// Update track width when slider mounts or resizes
	$effect(() => {
		if (sliderRef) {
			const updateWidth = () => {
				trackWidth = sliderRef.offsetWidth;
			};

			updateWidth();

			const resizeObserver = new ResizeObserver(updateWidth);
			resizeObserver.observe(sliderRef);

			return () => resizeObserver.disconnect();
		}
	});
</script>

<div
	bind:this={sliderRef}
	class="slider {className}"
	class:disabled
	class:dragging={isDragging}
	role="slider"
	tabindex={disabled ? -1 : 0}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value}
	aria-disabled={disabled}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onkeydown={handleKeyDown}
>
	<!-- Track -->
	<div class="track">
		<!-- Range (filled portion) -->
		<div class="range" style:width="{percentage()}%"></div>

		<!-- Thumb -->
		<div class="thumb" style:left={thumbLeft()}></div>
	</div>
</div>

<style>
	.slider {
		position: relative;
		width: 100%;
		height: 32px;
		padding: 8px 0;
		cursor: pointer;
		touch-action: none;
		user-select: none;
	}

	.slider:focus-visible {
		outline: 2px solid #007aff;
		outline-offset: 4px;
		border-radius: 16px;
	}

	.slider.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.slider.dragging {
		cursor: grabbing;
	}

	.track {
		position: relative;
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		top: 50%;
		transform: translateY(-50%);
		border: 0.5px solid rgba(0, 0, 0, 0.04);
	}

	.range {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: white;
		border-radius: 2px;
		transition: width 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.slider.dragging .range {
		transition: none;
	}

	.thumb {
		position: absolute;
		top: 50%;
		width: 16px;
		height: 16px;
		background: white;
		border: 0.5px solid rgba(0, 0, 0, 0.04);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		cursor: grab;
		box-shadow:
			0 0.5px 1px rgba(0, 0, 0, 0.12),
			0 1px 2px rgba(0, 0, 0, 0.08);
		transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.slider:hover .thumb {
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.16),
			0 2px 4px rgba(0, 0, 0, 0.12);
	}

	.slider.dragging .thumb {
		cursor: grabbing;
		transform: translate(-50%, -50%) scale(1.1);
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.2),
			0 4px 8px rgba(0, 0, 0, 0.16);
		transition: none;
	}

	.slider.disabled .thumb {
		background: rgba(255, 255, 255, 0.6);
		border-color: rgba(0, 0, 0, 0.02);
		cursor: not-allowed;
		box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.06);
	}

	.slider.disabled .range {
		background: rgba(255, 255, 255, 0.2);
	}

	.slider.disabled .track {
		background: rgba(255, 255, 255, 0.15);
	}
</style>
