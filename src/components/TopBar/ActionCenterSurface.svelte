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
		--border-size: 0;

		display: grid;
		grid-auto-rows: 1fr;
		gap: 0.25rem;

		position: relative;

		padding: 0.5rem;

		border-radius: 0.75rem;
		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 1px 4px -1px,
			inset 0 0 0 var(--border-size) lch(from var(--system-color-dark) l c h / 30%),
			0 0 0 var(--border-size) lch(from var(--system-color-light) l c h / 30%);

		background-color: lch(from var(--system-color-light) l c h / 50%);

		&.dark {
			--border-size: 0.4px;
		}
	}
</style>
