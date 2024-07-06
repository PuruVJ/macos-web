<script lang="ts">
	import { addMonths, format } from 'date-fns';
	import LeftArrow from '~icons/ic/round-chevron-left';
	import RightArrow from '~icons/ic/round-chevron-right';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import MonthView from './MonthView.svelte';

	const { view = 'month' }: { view?: 'year' | 'month' | 'week' | 'day' } = $props();

	let selected_date = $state(new Date());

	function goToToday() {
		selected_date = new Date();
	}

	function goPreviousMonth() {
		selected_date = addMonths(selected_date, -1);
	}

	function goNextMonth() {
		selected_date = addMonths(selected_date, 1);
	}
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	<header class="app-window-drag-handle titlebar"></header>

	<section class="main-area">
		<div class="calendar-header">
			<div>
				<span class="month">{format(selected_date, 'MMMM')}</span>
				<span class="year">{format(selected_date, 'yyyy')}</span>
			</div>

			<div class="control-buttons">
				<button onclick={goPreviousMonth}>
					<LeftArrow />
				</button>
				<button onclick={goToToday}>Today</button>
				<button onclick={goNextMonth}>
					<RightArrow />
				</button>
			</div>
		</div>

		{#if view === 'year'}
			<div></div>
		{:else if view === 'month'}
			<MonthView {selected_date} />
		{:else if view === 'week'}
			<div></div>
		{:else}
			<div></div>
		{/if}
	</section>
</section>

<style>
	.container {
		--title-bar-height: 2.5rem;

		background-color: var(--system-color-light);

		border-radius: inherit;

		overflow: hidden;

		&.dark {
			box-shadow:
				inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.2),
				0 0 0 1.5px hsla(var(--system-color-light-hsl), 0.5);
		}
	}

	.titlebar {
		padding: 1rem 1rem;

		width: 100%;
		height: var(--title-bar-height);

		position: absolute;
		top: 0;
		left: 0;
	}

	.main-area {
		color: var(--system-color-light-contrast);

		margin-top: var(--title-bar-height);

		height: calc(100% - var(--title-bar-height));
		width: 100%;

		overflow: hidden;

		display: flex;
		flex-direction: column;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 10px;
	}

	.month {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.year {
		font-size: 1.5rem;
	}

	.control-buttons {
		display: flex;
		align-items: flex-end;
		justify-content: center;

		button {
			--bgcolor: hsla(var(--system-color-light-hsl), 0.5);

			border-radius: 0.375rem;
			box-shadow: hsla(var(--system-color-dark-hsl), 0.4) 0px 0.5px 2px;

			background-color: var(--bgcolor);

			color: var(--system-color-dark);
			fill: var(--system-color-dark);
			font-weight: bold;

			padding: 0.2rem 0.5rem;
			margin: 0 0.05rem;

			height: 1.3rem;

			:global(svg) {
				font-size: 1.2rem;
			}

			:global(body.dark) & {
				--bgcolor: var(--system-color-grey-800);
				box-shadow: 0 0 white;
			}
		}
	}
</style>
