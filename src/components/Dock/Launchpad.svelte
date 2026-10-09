<script lang="ts">
	import { onMount } from 'svelte';
	import SearchIcon from '~icons/ic/round-search';
	import ClearIcon from '~icons/ic/round-close';
	import PreviousIcon from '~icons/ic/round-chevron-left';
	import NextIcon from '~icons/ic/round-chevron-right';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';

	const { on_close }: { on_close: () => void } = $props();
	const apps_per_page = 18;
	const launchable_apps = Object.entries(apps_config)
		.filter(([, config]) => config.should_open_window)
		.map(([id, config]) => ({ id: id as AppID, title: config.title }));

	let search_query = $state('');
	let page_index = $state(0);
	let search_input = $state<HTMLInputElement>();

	const filtered_apps = $derived(
		launchable_apps.filter(({ title }) =>
			title.toLocaleLowerCase().includes(search_query.trim().toLocaleLowerCase()),
		),
	);
	const page_count = $derived(Math.max(1, Math.ceil(filtered_apps.length / apps_per_page)));
	const visible_apps = $derived(
		filtered_apps.slice(page_index * apps_per_page, (page_index + 1) * apps_per_page),
	);

	$effect(() => {
		search_query;
		page_index = 0;
	});

	onMount(() => search_input?.focus());

	function launchApp(app_id: AppID) {
		apps.open[app_id] = true;
		apps.minimized[app_id] = false;
		delete apps.minimized_previews[app_id];
		apps.active = app_id;
		on_close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			on_close();
			return;
		}

		if (event.target === search_input) return;
		if (event.key === 'ArrowRight' && page_count > 1) {
			page_index = (page_index + 1) % page_count;
		}
		if (event.key === 'ArrowLeft' && page_count > 1) {
			page_index = (page_index - 1 + page_count) % page_count;
		}
	}
</script>

<div
	class="launchpad"
	role="dialog"
	aria-label="Launchpad"
	aria-modal="true"
	tabindex="-1"
	onkeydown={handleKeydown}
	onpointerdown={(event) => {
		if (event.target instanceof Element && !event.target.closest('button, input, label')) {
			on_close();
		}
	}}
>
	<div class="search-wrap">
		<label class="search-field">
			<SearchIcon />
			<input
				bind:this={search_input}
				bind:value={search_query}
				aria-label="Search apps"
				placeholder="Search"
			/>
			{#if search_query}
				<button
					class="clear-search"
					aria-label="Clear search"
					onclick={() => {
						search_query = '';
						search_input?.focus();
					}}
				>
					<ClearIcon />
				</button>
			{/if}
		</label>
	</div>

	<div class="apps-viewport">
		{#if visible_apps.length}
			<div class="app-grid">
				{#each visible_apps as app (app.id)}
					<button class="app-item" onclick={() => launchApp(app.id)} aria-label="Open {app.title}">
						<img src="/app-icons/{app.id}/256.webp" alt="" draggable="false" />
						<span>{app.title}</span>
					</button>
				{/each}
			</div>
		{:else}
			<p class="empty-state">No apps found</p>
		{/if}
	</div>

	<footer class="page-controls">
		{#if page_count > 1}
			<button
				class="page-arrow"
				aria-label="Previous page"
				onclick={() => (page_index = (page_index - 1 + page_count) % page_count)}
			>
				<PreviousIcon />
			</button>
			<div class="page-dots" aria-label="Page {page_index + 1} of {page_count}">
				{#each Array(page_count) as _, index}
					<button
						class="page-dot"
						class:current={page_index === index}
						aria-label="Go to page {index + 1}"
						aria-current={page_index === index ? 'page' : undefined}
						onclick={() => (page_index = index)}
					></button>
				{/each}
			</div>
			<button
				class="page-arrow"
				aria-label="Next page"
				onclick={() => (page_index = (page_index + 1) % page_count)}
			>
				<NextIcon />
			</button>
		{/if}
	</footer>
</div>

<style>
	.launchpad {
		position: fixed;
		inset: 0;
		z-index: 75;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: clamp(1.5rem, 6vh, 4rem) max(1.5rem, 5vw) 6.2rem;
		color: white;
		background: rgba(20, 30, 48, 0.28);
		backdrop-filter: blur(34px) saturate(1.35);
		-webkit-backdrop-filter: blur(34px) saturate(1.35);
		animation: launchpad-in 180ms ease-out both;
	}

	.search-wrap {
		display: flex;
		justify-content: center;
	}

	.search-field {
		width: min(22rem, 82vw);
		height: 2.25rem;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.16);
		color: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(18px);

		:global(svg) {
			flex: 0 0 auto;
			width: 1.15rem;
			height: 1.15rem;
		}

		input {
			width: 100%;
			min-width: 0;
			border: 0;
			outline: 0;
			background: transparent;
			color: white;
			font-size: 0.95rem;
		}

		input:focus-visible {
			box-shadow: none;
		}

		input::placeholder {
			color: rgba(255, 255, 255, 0.78);
		}
	}

	.clear-search,
	.page-arrow {
		flex: 0 0 auto;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		color: white;

		:global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}

		&:hover {
			background: rgba(255, 255, 255, 0.2);
		}
	}

	.apps-viewport {
		min-height: 0;
		display: grid;
		place-items: center;
	}

	.app-grid {
		width: min(68rem, 100%);
		display: grid;
		grid-template-columns: repeat(6, minmax(4.5rem, 1fr));
		justify-items: center;
		align-items: center;
		column-gap: clamp(0.75rem, 3vw, 2.75rem);
		row-gap: clamp(1.5rem, 5vh, 3.25rem);
	}

	.app-item {
		width: 100%;
		max-width: 7.25rem;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.65rem;
		padding: 0.25rem;
		border-radius: 0.6rem;
		color: white;
		text-align: center;
		text-shadow: 0 1px 5px rgba(0, 0, 0, 0.45);
		cursor: var(--system-cursor-pointer), pointer;

		img {
			width: clamp(3.5rem, 8vw, 5rem);
			aspect-ratio: 1;
			object-fit: contain;
			filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.28));
			transition: transform 140ms ease;
		}

		span {
			max-width: 100%;
			font-size: 0.8rem;
			line-height: 1.2;
			text-wrap: balance;
		}

		&:hover,
		&:focus-visible {
			background: rgba(255, 255, 255, 0.12);

			img {
				transform: scale(1.08);
			}
		}
	}

	.empty-state {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.page-controls {
		min-height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.9rem;
	}

	.page-dots {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.page-dot {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.45);

		&.current {
			background: white;
		}
	}

	@keyframes launchpad-in {
		from {
			opacity: 0;
			backdrop-filter: blur(0) saturate(1);
		}
		to {
			opacity: 1;
			backdrop-filter: blur(34px) saturate(1.35);
		}
	}

	@media (max-width: 680px) {
		.launchpad {
			padding: 1.25rem 1rem 6rem;
		}

		.app-grid {
			grid-template-columns: repeat(3, minmax(4.25rem, 1fr));
			column-gap: 0.6rem;
			row-gap: 1.25rem;
		}
	}
</style>
