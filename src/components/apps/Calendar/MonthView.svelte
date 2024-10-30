<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { DAYS_OF_THE_WEEK } from './calendar-constants.ts';
	import { get_display_days } from './calendar-utils.ts';

	const { selected_date }: { selected_date: Date } = $props();

	const today = new Date();

	const display_days = $derived(get_display_days(selected_date));

	function is_today(date: number, is_this_month: boolean) {
		return (
			selected_date.getFullYear() === today.getFullYear() &&
			is_this_month &&
			selected_date.getMonth() === today.getMonth() &&
			date === today.getDate()
		);
	}

	function dayKey(date: number) {
		return [date, selected_date.getMonth()].join('-');
	}
</script>

<div class="container" class:dark={preferences.theme.scheme === 'dark'}>
	{#each DAYS_OF_THE_WEEK as day, i}
		<div class="weekday" class:weekend={[5, 6].includes(i)}>{day}</div>
	{/each}

	{#each display_days.days_in_prev_month as date (dayKey(date))}
		<div class="day" class:today={is_today(date, false)}>
			<div class="date-number" class:this-month={false}>{date}</div>
		</div>
	{/each}

	{#each display_days.days_in_this_month as date (dayKey(date))}
		<div class="day" class:today={is_today(date, true)}>
			<div class="date-number" class:this-month={true}>{date}</div>
		</div>
	{/each}

	{#each display_days.days_in_next_month as date (dayKey(date))}
		<div class="day" class:today={is_today(date, false)}>
			<div class="date-number" class:this-month={false}>{date}</div>
		</div>
	{/each}
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: 30px repeat(6, 1fr);

		flex-grow: 1;

		font-size: 0.95rem;

		> div {
			padding: 0.5rem;
			text-align: right;
		}
	}

	.container.dark .day {
		&:nth-child(7n),
		&:nth-child(7n-1) {
			--bgcolor: #212121;
			--color: #eee;
		}
	}

	.day {
		border: 1px solid #e6e5e6;
		border-top: none;

		display: flex;
		justify-content: flex-end;

		&:nth-child(1n) {
			border-left: none;
		}

		&:nth-child(7n) {
			border-right: none;
		}
		&:nth-child(n + 43) {
			border-bottom: none;
		}

		&:nth-child(7n),
		&:nth-child(7n-1) {
			--bgcolor: var(--system-color-grey-100);
			--color: var(--system-color-dark);

			background-color: var(--bgcolor) !important;
			color: var(--color);
		}

		.date-number {
			--size: 1.5rem;

			height: var(--size);
			width: var(--size);

			line-height: var(--size);
			text-align: center;

			border-radius: 50%;

			display: flex;
			justify-content: center;
			align-items: center;

			color: var(--system-color-grey-500);
		}

		.this-month {
			color: var(--system-color-dark);

			:global(body.dark) & {
				color: var(--system-color-dark);
			}
		}

		&.today {
			.date-number {
				color: #fff;
				background-color: #ec4d3c;

				--size: 1.7rem;
			}
		}
	}

	.weekday,
	.weekend {
		border-bottom: 1.5px solid #c7c7cc;
	}

	.weekend {
		color: #808080;
	}
</style>
