<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';

	const { app_id }: { app_id: AppID } = $props();
	const title = $derived(apps_config[app_id].title);

	let preview_container = $state<HTMLSpanElement>();
	let resize_observer: ResizeObserver | undefined;
	let mutation_observer: MutationObserver | undefined;

	$effect(() => {
		const preview = apps.minimized_previews[app_id];
		if (!preview || !preview_container) return;

		function updatePreview() {
			const rect = apps.window_rects[app_id];
			if (!rect) return;

			const clone = preview.cloneNode(true) as HTMLElement;
			clone.removeAttribute('hidden');
			clone.style.setProperty('position', 'absolute', 'important');
			clone.style.setProperty('left', '0', 'important');
			clone.style.setProperty('top', '0', 'important');
			clone.style.setProperty('width', `${rect.width}px`, 'important');
			clone.style.setProperty('height', `${rect.height}px`, 'important');
			clone.style.setProperty('transform-origin', 'top left', 'important');
			clone.style.setProperty(
				'transform',
				`scale(${preview_container!.clientWidth / rect.width}, ${preview_container!.clientHeight / rect.height})`,
				'important',
			);
			clone.style.setProperty('translate', 'none', 'important');
			clone.style.setProperty('border-radius', '0.75rem', 'important');
			clone.style.setProperty('box-shadow', 'none', 'important');
			clone.style.setProperty('overflow', 'hidden', 'important');
			clone.style.setProperty('pointer-events', 'none', 'important');
			clone.style.setProperty('z-index', '0', 'important');

			for (const button of clone.querySelectorAll('button')) {
				button.style.setProperty('cursor', 'var(--system-cursor-default), auto', 'important');
			}

			preview_container!.replaceChildren(clone);
		}

		updatePreview();
		mutation_observer = new MutationObserver(updatePreview);
		mutation_observer.observe(preview, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		});
		resize_observer = new ResizeObserver(updatePreview);
		resize_observer.observe(preview_container);

		return () => {
			mutation_observer?.disconnect();
			resize_observer?.disconnect();
		};
	});

	function restoreWindow() {
		const rect = preview_container?.parentElement?.getBoundingClientRect();
		if (rect) {
			apps.minimized_rects[app_id] = {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
			};
		}
		apps.minimized[app_id] = false;
		apps.active = app_id;
	}
</script>

<button
	class="minimized-window"
	data-minimized-window={app_id}
	aria-label="Restore {title} window"
	title="Restore {title}"
	onclick={restoreWindow}
>
	<span class="preview" bind:this={preview_container}></span>
	<img src="/app-icons/{app_id}/256.webp" alt="" draggable="false" />
</button>

<style>
	.minimized-window {
		position: relative;
		flex: 0 0 auto;
		width: 4rem;
		height: 2.75rem;
		margin: 0 0.2rem 0.35rem;
		overflow: hidden;
		border: 1px solid hsla(var(--system-color-light-hsl), 0.6);
		border-radius: 0.35rem;
		background: hsla(var(--system-color-dark-hsl), 0.3);
		box-shadow: 0 2px 7px hsla(var(--system-color-dark-hsl), 0.35);
		cursor: var(--system-cursor-default), auto;
		animation: dock-window-appear 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	.preview {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;
		pointer-events: none;
	}

	img {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 1;
		width: 1.05rem;
		height: 1.05rem;
		border-radius: 0.25rem;
		box-shadow: 0 1px 3px hsla(var(--system-color-dark-hsl), 0.6);
		pointer-events: none;
	}

	@keyframes dock-window-appear {
		from {
			opacity: 0;
			transform: translateY(0.65rem) scale(0.72);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
