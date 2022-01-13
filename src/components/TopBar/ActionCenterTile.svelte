<script lang="ts">
  export let grid: [rowStart: number, rowSpan: number];
  export let role = 'button';

  const [rowStart, rowSpan] = grid;
</script>

<button
  class="container"
  style:grid-row="{rowStart} / span {rowSpan}"
  tabindex={role === 'button' ? 0 : -1}
  on:click
  on:keyup
  {role}
>
  <slot />
</button>

<style>
  .container {
    display: flex;
    gap: 0.4rem;
    align-items: center;

    border-radius: inherit;

    font-size: 0.85rem;
    font-weight: 600;
    color: var(--system-color-dark);
    text-align: start;
  }
</style>
