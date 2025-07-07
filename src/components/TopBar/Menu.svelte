<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { menu }: { menu: any } = $props();
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	{#each Object.entries(menu) as Array<[any, any]> as [_, val]}
		<button class="menu-item" disabled={val.disabled}>{val.title}</button>
		{#if val.breakAfter}
			<div class="divider"></div>
		{/if}
	{/each}
</section>

<style>
	.container {
		/* // Initial invisible border */
		--additional-box-shadow: inset 0 0 0 0.7px
				color-mix(in lch, var(--system-color-dark), transparent 50%),
			0 0 0 0.1px color-mix(in lch, var(--system-color-dark), transparent 80%);

		display: block;

		min-width: 16rem;
		width: max-content;

		padding: 0.5rem;

		position: relative;

		user-select: none;

		background-color: color-mix(in lch, var(--system-color-light), transparent 70%);
		backdrop-filter: blur(10px);

		border-radius: 1rem;

		box-shadow:
			lch(0% 0 0 / 0.2) 0px 4px 9px 0px,
			var(--additional-box-shadow);
	}

	.menu-item {
		--alpha: 0%;

		display: flex;
		justify-content: flex-start;

		width: 100%;

		padding: 0.2rem 0.4rem;
		margin: 0.1rem;

		/* letter-spacing: 0.4px; */
		font-weight: 400 !important;
		font-size: 0.8rem !important;

		border-radius: 0.3rem;

		transition: none;

		color: color-mix(in lch, var(--system-color-dark), transparent var(--alpha));

		&:disabled {
			--alpha: 50%;
		}

		&:not(:disabled) {
			&:hover,
			&:focus-visible {
				background-color: var(--system-color-primary);
				color: white;
				/* color: var(--system-color-primary-contrast); */
				/* font-weight: 500 !important; */
			}
		}
	}

	.divider {
		width: 100%;
		height: 0.2px;

		background-color: color-mix(in lch, var(--system-color-dark), transparent 80%);

		margin: 4px 0;
	}
</style>
