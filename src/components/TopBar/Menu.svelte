<script lang="ts">
  import { theme } from '🍎/stores/theme.store';

  export let menu: any;
</script>

<section class="container" class:dark={$theme.scheme === 'dark'}>
  {#each Object.entries(menu) as [, val]}
    <button class="menu-item" disabled={val.disabled}>{val.title}</button>
    {#if val.breakAfter}
      <div class="divider" />
    {/if}
  {/each}
</section>

<style lang="scss">
  .container {
    // Initial invisible border
    --additional-box-shadow: 0 0 0 0 white;

    display: block;

    min-width: 16rem;
    width: max-content;

    padding: 0.5rem;

    position: relative;

    user-select: none;

    background-color: hsla(var(--system-color-light-hsl), 0.3);
    backdrop-filter: blur(25px);

    border-radius: 0.5rem;

    box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px, var(--additional-box-shadow);

    &.dark {
      --additional-box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
        0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
    }
  }

  .menu-item {
    --alpha: 1;

    display: flex;
    justify-content: flex-start;

    width: 100%;

    padding: 0.2rem 0.4rem;
    margin: 0.1rem;

    letter-spacing: 0.4px;
    font-weight: 400 !important;
    font-size: 0.9rem !important;

    border-radius: 0.3rem;

    transition: none;

    color: hsla(var(--system-color-dark-hsl), var(--alpha));

    &:disabled {
      --alpha: 0.5;
    }

    &:not(:disabled) {
      &:hover,
      &:focus-visible {
        background-color: var(--system-color-primary);
        color: var(--system-color-primary-contrast);
        font-weight: 500 !important;
      }
    }
  }

  .divider {
    width: 100%;
    height: 0.2px;

    background-color: hsla(var(--system-color-dark-hsl), 0.3);

    margin: 2px 0;
  }
</style>
