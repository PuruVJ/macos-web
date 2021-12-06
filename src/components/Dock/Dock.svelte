<script lang="ts">
  import { elevation } from '🍎/actions';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { appsInFullscreen } from '🍎/stores/apps.store';
  import { systemNeedsUpdate } from '🍎/stores/system.store';
  import DockItem from './DockItem.svelte';

  let mouseX: number | null = null;

  $: isDockAutoHidden = Object.values($appsInFullscreen).some(Boolean);
</script>

<section class="dock-container" use:elevation={'dock'}>
  <div class="hover-strip" />

  <div
    class="dock-el"
    class:auto-hidden={isDockAutoHidden}
    on:mousemove={(event) => (mouseX = event.x)}
    on:mouseleave={() => (mouseX = null)}
  >
    {#each Object.entries(appsConfig) as [appID, config]}
      {#if config.dockBreaksBefore}
        <div class="divider" aria-hidden="true" />
      {/if}
      <DockItem {mouseX} {appID} needsUpdate={$systemNeedsUpdate} />
    {/each}
  </div>
</section>

<style lang="scss">
  .dock-container {
    margin-bottom: 0.3rem;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 5.2rem;

    padding: 0.4rem;

    display: flex;
    justify-content: center;
  }

  .hover-strip {
    position: fixed;
    bottom: 0;
    left: 0;

    height: 3rem;
    width: 100%;
  }

  .hover-strip:hover ~ .dock-el.auto-hidden,
  .dock-el.auto-hidden:hover {
    transform: translate3d(0, 0, 0);
  }

  .dock-el {
    background-color: hsla(var(--system-color-light-hsl), 0.4);

    box-shadow: inset 0 0 0 0.2px hsla(var(--system-color-grey-100-hsl), 0.7),
      0 0 0 0.2px hsla(var(--system-color-grey-900-hsl), 0.7), hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

    position: relative;

    padding: 0.3rem;

    border-radius: 1.2rem;

    height: 100%;

    display: flex;
    align-items: flex-end;

    transition: transform 0.2s ease;

    &.auto-hidden {
      transform: translate3d(0, 200%, 0);

      &::before {
        width: calc(100% - 2px);
        height: calc(100% - 2px);

        margin-top: 1px;
        margin-left: 1px;
      }
    }

    &::before {
      content: '';

      border-radius: 20px;

      width: 100%;
      height: 100%;

      border: inherit;

      backdrop-filter: blur(10px);

      position: absolute;
      top: 0;
      left: 0;

      z-index: -1;
    }
  }

  .divider {
    height: 100%;
    width: 0.2px;

    background-color: hsla(var(--system-color-dark-hsl), 0.3);

    margin: 0 4px;
  }
</style>
