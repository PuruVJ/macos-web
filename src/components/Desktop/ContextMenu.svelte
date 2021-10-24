<script lang="ts">
  import { contextMenuConfig } from '__/configs/menu/context.menu.config';
  import { fadeIn, fadeOut } from '__/helpers/fade';
  import { theme } from '__/stores/theme.store';

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
    class:dark={$theme === 'dark'}
    style="transform: translate({xPos}px, {yPos}px);"
    in:fadeIn={{ duration: 80 }}
    out:fadeOut
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
    z-index: 99999999;

    min-width: 16rem;

    padding: 0.5rem;

    position: absolute;

    -webkit-font-smoothing: antialiased;
    user-select: none;
    transition: transform 100ms ease;

    background-color: hsla(var(--app-color-light-hsl), 0.3);
    backdrop-filter: blur(15px);

    border-radius: 0.5rem;

    box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px, var(--additional-shadow);

    &.dark {
      --additional-shadow: inset 0 0 0 0.9px hsla(var(--app-color-dark-hsl), 0.3),
        0 0 0 1.2px hsla(var(--app-color-light-hsl), 0.3);
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

    color: hsla(var(--app-color-dark-hsl), var(--alpha));

    &:hover,
    &:focus-visible {
      background-color: var(--app-color-primary);
      color: var(--app-color-primary-contrast);
    }
  }

  .divider {
    width: 100%;
    height: 0.2px;

    background-color: hsla(var(--app-color-dark-hsl), 0.2);

    margin: 2px 0;
  }
</style>
