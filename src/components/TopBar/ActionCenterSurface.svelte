<script lang="ts">
	import type { Snippet } from 'svelte';
	import { theme } from '🍎/state/preferences.svelte.ts';

	const {
		grid,
		children,
	}: {
		grid: [[columnStart: number, columnSpan: number], [rowStart: number, rowSpan: number]];
		children: Snippet;
	} = $props();

	const [[columnStart, columnSpan], [rowStart, rowSpan]] = grid;
</script>

<section
	class="container"
	class:dark={theme.scheme === 'dark'}
	style:grid-column="{columnStart} / span {columnSpan}"
	style:grid-row="{rowStart} / span {rowSpan}"
>
	{@render children?.()}
</section>

<style>
	.container {
		--border-size: 1px;

		display: grid;
		grid-auto-rows: 1fr;
		gap: 0.25rem;

		position: relative;

		padding: 0.75rem;

		border-radius: 1.9rem;
		background-color: lch(from var(--accent-blue) l c h / 5%);

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
	}

	.container::before {
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
</style>
