<script lang="ts">
  import SearchIcon from '~icons/material-symbols/search';
  import { clickOutside, focusOutside } from '🍎/actions';

  let searchbarVal = '';
  let placeholderValue = 'Search or enter address';

  let searchFocused = false;
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section
  class="search-box"
  tabindex={0}
  use:clickOutside={{ callback: () => (searchFocused = false) }}
  use:focusOutside={{ callback: () => (searchFocused = false) }}
  on:click={() => (searchFocused = true)}
  on:keyup={(e) => e.key === ' ' && (searchFocused = true)}
>
  <div class="facade" class:focus-state={searchFocused}>
    <span class="search-icon" aria-hidden="true"><SearchIcon /></span>

    <span class="placeholder" style:visibility={searchbarVal ? 'hidden' : 'visible'}>
      {placeholderValue}</span
    >
  </div>

  <input type="text" bind:value={searchbarVal} />
</section>

<style lang="scss">
  .search-box {
    position: relative;

    width: 39%;
    height: 1.8rem;

    border-radius: 0.4rem;

    font-size: 0.87rem;
    font-weight: 300;
    color: hsl(var(--system-color-dark-hsl));

    background-color: hsla(var(--system-color-light-tint-hsl), 0.8);
    // backdrop-filter: blur(10px);
  }

  .facade {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    transition: 400ms cubic-bezier(0.3, 0.81, 0.2, 0.99);
    transition-property: transform, left;

    transform: translate(-50%, -50%);

    color: hsla(var(--system-color-dark-hsl), 0.5);
    pointer-events: none;

    &.focus-state {
      left: -19%;
      transform: translate(0, -50%);
    }
  }

  .facade .placeholder {
    color: hsla(var(--system-color-dark-hsl), 0.5);
  }

  .search-icon {
    color: hsla(var(--system-color-dark-hsl), 0.7);

    transform: translateY(1px);
  }

  input {
    width: 100%;
    height: 100%;

    border-radius: inherit;

    padding: 0.5rem;
    padding-left: 1.75rem;

    caret-color: var(--system-color-dark);
    color: inherit;
    cursor: text;

    border: none;

    background-color: inherit;
  }
</style>
