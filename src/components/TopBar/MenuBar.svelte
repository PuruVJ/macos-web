<script lang="ts">
  import { clickOutside, elevation, focusOutside } from '🍎/actions';
  import { activeMenu, menuBarMenus } from '🍎/stores/menubar.store';
  import AppleIcon from '~icons/mdi/apple';
  import Menu from './Menu.svelte';
</script>

<div
  class="container"
  use:clickOutside={{ callback: () => ($activeMenu = '') }}
  use:focusOutside={{ callback: () => ($activeMenu = '') }}
>
  {#each Object.entries($menuBarMenus) as [menuID, menuConfig]}
    <div>
      <div style:height="100%">
        <button
          class="menu-button"
          class:default-menu={menuID === 'default'}
          class:apple-icon-button={menuID === 'apple'}
          style:--scale={$activeMenu === menuID ? 1 : 0}
          on:click={() => ($activeMenu = menuID)}
          on:mouseover={() => $activeMenu && ($activeMenu = menuID)}
          on:focus={() => ($activeMenu = menuID)}
        >
          {#if menuID === 'apple'}
            <AppleIcon />
          {:else}
            {menuConfig.title}
          {/if}
        </button>
      </div>

      <div
        class="menu-parent"
        style:visibility={$activeMenu === menuID ? 'visible' : 'hidden'}
        use:elevation={'menubar-menu-parent'}
      >
        <Menu menu={menuConfig.menu} />
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .container {
    height: 100%;

    display: flex;
    position: relative;
  }

  .menu-parent {
    position: absolute;
    margin-top: 1.5px;
  }

  .menu-button {
    font-weight: 500;

    border-radius: 0.25rem;

    position: relative;
    z-index: 1;

    padding: 0 0.5rem;

    height: 100%;

    &.default-menu {
      font-weight: 600 !important;
      margin: 0 6px;
    }

    &::after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;

      height: 100%;
      width: 100%;

      border-radius: inherit;

      transform: scale(var(--scale), var(--scale));
      transform-origin: center center;

      transition: transform 100ms ease;

      background-color: hsla(var(--system-color-dark-hsl), 0.2);
    }
  }

  .apple-icon-button {
    margin: 0 0rem 0 0.5rem;
    padding: 0 0.7rem;

    display: block;

    :global(svg) {
      font-size: 1rem;
    }
  }
</style>
