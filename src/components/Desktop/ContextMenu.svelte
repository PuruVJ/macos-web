<script lang="ts">
  import { elevation } from '🍎/actions';
  import { contextMenuConfig } from '🍎/configs/menu/context.menu.config';
  import { fadeOut } from '🍎/helpers/fade';
  import { theme } from '🍎/stores/theme.store';

  export let targetElement: HTMLElement;

  let xPos = 0;
  let yPos = 0;
  let isMenuVisible = false;

  function handleContextMenu(e: MouseEvent) {
    if (!targetElement?.contains(e.target as HTMLElement)) return (isMenuVisible = false);

    let x = e.pageX;
    let y = e.pageY;

    // Open to other side if rest of space is too small
    if (window.innerWidth - x < 250) x -= 250;
    if (window.innerHeight - y < 300) y -= 250;

    xPos = x;
    yPos = y;

    isMenuVisible = true;
  }

  function hideMenu() {
    isMenuVisible = false;
  }
</script>

<svelte:body on:contextmenu|preventDefault={handleContextMenu} on:click={hideMenu} />

{#if isMenuVisible}
  <div
    class="container"
    class:dark={$theme.scheme === 'dark'}
    style:transform="translate({xPos}px, {yPos}px)"
    out:fadeOut
    use:elevation={'context-menu'}
  >
    {#each Object.values(contextMenuConfig.default) as contents}
      <button class="menu-item">{contents.title}</button>

      {#if contents.breakAfter}
        <div class="divider" />
      {/if}
    {/each}
  </div>
{/if}

<style lang="scss">
  .container {
    --additional-shadow: 0 0 0 0 white;
    display: block;

    min-width: 16rem;

    padding: 0.5rem;

    position: fixed;
    top: 0;
    left: 0;

    -webkit-font-smoothing: antialiased;
    user-select: none;

    background-color: hsla(var(--system-color-light-hsl), 0.3);

    border-radius: 0.5rem;

    box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px, var(--additional-shadow);

    &.dark {
      --additional-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
        0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);

      &::before {
        transform: scale(0.99);
      }
    }

    &::before {
      content: '';

      width: 100%;
      height: 100%;

      border-radius: inherit;

      position: absolute;
      left: 0;
      top: 0;

      transform: scale(0.996);

      z-index: -1;
      backdrop-filter: blur(15px);
    }

    * {
      -webkit-font-smoothing: antialiased;
    }
  }

  .menu-item {
    --alpha: 1;

    display: flex;
    justify-content: flex-start;

    width: 100%;

    padding: 0.3rem 0.4rem;
    margin: 0.2rem 0;

    letter-spacing: 0.4px;
    font-weight: 400;
    font-size: 0.9rem;

    border-radius: 0.3rem;

    backface-visibility: hidden;
    transition: none;

    color: hsla(var(--system-color-dark-hsl), var(--alpha));

    &:hover,
    &:focus-visible {
      background-color: var(--system-color-primary);
      color: var(--system-color-primary-contrast);
    }
  }

  .divider {
    width: 100%;
    height: 0.2px;

    background-color: hsla(var(--system-color-dark-hsl), 0.2);

    margin: 2px 0;
  }
</style>
