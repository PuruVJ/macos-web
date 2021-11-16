<script lang="ts">
  import { addMonths, format } from 'date-fns';
  import { theme } from '🍎/stores/theme.store';
  import LeftArrow from '~icons/ic/round-chevron-left';
  import RightArrow from '~icons/ic/round-chevron-right';
  import MonthView from './MonthView.svelte';

  export let view: 'year' | 'month' | 'week' | 'day' = 'month';

  let selectedDate = new Date();

  function goToToday() {
    selectedDate = new Date();
  }

  function goPreviousMonth() {
    selectedDate = addMonths(selectedDate, -1);
  }

  function goNextMonth() {
    selectedDate = addMonths(selectedDate, 1);
  }
</script>

<section class="container" class:dark={$theme.scheme === 'dark'}>
  <header class="app-window-drag-handle titlebar" />

  <section class="main-area">
    <div class="calendar-header">
      <div>
        <span class="month">{format(selectedDate, 'MMMM')}</span>
        <span class="year">{format(selectedDate, 'yyyy')}</span>
      </div>

      <div class="control-buttons">
        <button on:click={goPreviousMonth}>
          <LeftArrow />
        </button>
        <button on:click={goToToday}>Today</button>
        <button on:click={goNextMonth}>
          <RightArrow />
        </button>
      </div>
    </div>

    {#if view === 'year'}
      <div />
    {:else if view === 'month'}
      <MonthView {selectedDate} />
    {:else if view === 'week'}
      <div />
    {:else}
      <div />
    {/if}
  </section>
</section>

<style lang="scss">
  .container {
    background-color: var(--system-color-light);

    border-radius: inherit;

    overflow: hidden;

    &.dark {
      box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.2),
        0 0 0 1.5px hsla(var(--system-color-light-hsl), 0.5);
    }
  }

  $title-bar-height: 2.5rem;

  .titlebar {
    padding: 1rem 1rem;

    width: 100%;
    height: $title-bar-height;

    position: absolute;
    top: 0;
    left: 0;
  }

  .main-area {
    color: var(--system-color-light-contrast);

    margin-top: $title-bar-height;

    height: calc(100% - #{$title-bar-height});
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
