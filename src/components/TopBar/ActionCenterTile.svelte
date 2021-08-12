<script lang="ts">
  export let grid: [rowStart: number, rowSpan: number];

  const [rowStart, rowsPan] = grid;
</script>

<div class="container" style="grid-row: {rowStart} / span {rowsPan}">
  <slot />
</div>

<style>
  .container {
    display: flex;
    gap: 0.4rem;
    align-items: center;

    font-size: 0.85rem;
    font-weight: 600;
    color: var(--app-color-dark);
  }
</style>
