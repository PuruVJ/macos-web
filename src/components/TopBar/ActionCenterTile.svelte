<script lang="ts">
  export let grid: [rowStart: number, rowSpan: number];
  export let focusable = false;

  const [rowStart, rowsPan] = grid;
</script>

<div
  class="container"
  style="grid-row: {rowStart} / span {rowsPan}"
  tabindex={focusable ? 0 : -1}
  on:click
  on:keyup
>
  <slot />
</div>

<style>
  .container {
    display: flex;
    gap: 0.4rem;
    align-items: center;

    border-radius: inherit;

    font-size: 0.85rem;
    font-weight: 600;
    color: var(--system-color-dark);
  }
</style>
