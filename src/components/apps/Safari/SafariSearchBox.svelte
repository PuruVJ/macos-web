<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import SearchIcon from '~icons/material-symbols/search';
  import { clickOutside, focusOutside } from '🍎/actions';
  import { theme } from '🍎/stores/theme.store';

  const dispatch = createEventDispatcher<{ search: { query: string } }>();

  let searchbarVal = '';
  let placeholderValue = 'Search or enter address';

  let searchFocused = false;

  let inputEl: HTMLInputElement;
</script>

<button
  class="search-box"
  class:dark={$theme.scheme === 'dark'}
  tabindex={0}
  use:clickOutside={() => (searchFocused = false)}
  use:focusOutside={() => (searchFocused = false)}
  on:click={() => (searchFocused = true)}
  on:focus={() => {
    inputEl.focus();
    searchFocused = true;
  }}
>
  <div class="facade" class:focus-state={searchbarVal || searchFocused}>
    <span class="search-icon" aria-hidden="true"><SearchIcon /></span>

    <span class="placeholder" style:visibility={searchbarVal ? 'hidden' : 'visible'}>
      {placeholderValue}</span
    >
  </div>

  <form on:submit|preventDefault={() => dispatch('search', { query: searchbarVal })}>
    <input
      type="text"
      bind:value={searchbarVal}
      bind:this={inputEl}
      on:focusin={() => (searchFocused = true)}
    />
  </form>
</button>

<style lang="scss">
  .search-box {
    display: block;

    position: relative;

    height: 1.8rem;

    border-radius: 0.4rem;

    font-size: 0.87rem;
    font-weight: 300;
    color: var(--system-color-dark);

    background-color: hsla(var(--system-color-light-shade-hsl), 0.8);

    &.dark {
      background-color: hsla(var(--system-color-light-tint-hsl), 0.7);
    }
  }

  .facade {
    position: absolute;
    top: 50%;
    left: 50%;

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
      left: 8px;
      transform: translate(0, -50%);
    }
  }

  .facade .placeholder {
    color: hsla(var(--system-color-dark-hsl), 0.5);
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
  }

  .search-icon {
    color: hsla(var(--system-color-dark-hsl), 0.7);

    transform: translateY(1px);
  }

  form {
    display: contents;
    border-radius: inherit;
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
