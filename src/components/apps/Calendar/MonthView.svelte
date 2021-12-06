<script lang="ts">
  import { theme } from '🍎/stores/theme.store';

  import { DAYS_OF_THE_WEEK } from './calendar-constants';
  import { getDisplayDays } from './calendar-utils';

  export let selectedDate: Date;

  const today = new Date();

  function isToday(date: number, isThisMonth: boolean) {
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      isThisMonth &&
      selectedDate.getMonth() === today.getMonth() &&
      date === today.getDate()
    );
  }

  function dayKey(date) {
    return [date, selectedDate.getMonth()].join('-');
  }

  $: ({ daysInPrevMonth, daysInThisMonth, daysInNextMonth } = getDisplayDays(selectedDate));
</script>

<div class="container" class:dark={$theme.scheme === 'dark'}>
  {#each DAYS_OF_THE_WEEK as day, i}
    <div class="weekday" class:weekend={[5, 6].includes(i)}>{day}</div>
  {/each}

  {#each daysInPrevMonth as date (dayKey(date))}
    <div class="day" class:today={isToday(date, false)}>
      <div class="date-number" class:this-month={false}>{date}</div>
    </div>
  {/each}

  {#each daysInThisMonth as date (dayKey(date))}
    <div class="day" class:today={isToday(date, true)}>
      <div class="date-number" class:this-month={true}>{date}</div>
    </div>
  {/each}

  {#each daysInNextMonth as date (dayKey(date))}
    <div class="day" class:today={isToday(date, false)}>
      <div class="date-number" class:this-month={false}>{date}</div>
    </div>
  {/each}
</div>

<style lang="scss">
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
