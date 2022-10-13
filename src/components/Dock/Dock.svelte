<script lang="ts">
  import { elevation } from '🍎/actions';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { appsInFullscreen } from '🍎/stores/apps.store';
  import { systemNeedsUpdate } from '🍎/stores/system.store';
  import { isDockHidden } from '🍎/stores/dock.store';
  import DockItem from './DockItem.svelte';

  let dockMouseX: number | null = null;

  const HIDDEN_DOCK_THRESHOLD = 30;
  let bodyHeight = 0;
  let mouseY = 0;

  let dockContainerEl: HTMLElement;

  $: {
    // Due to how pointer-events: none works, if dock auto opens, you move away, it won't close automatically.
    // So close it manually if mouse pointer goes out of the dock area.
    if (Math.abs(mouseY - bodyHeight) > dockContainerEl?.clientHeight) {
      dockMouseX = null;
    }

    /**
     * if mouseX != null then show the dock. No matter what
     * When it becomes null, Then use the mouseY and bodyHeight to determine if the dock should be hidden
     */
    if (dockMouseX !== null) {
      $isDockHidden = false;
      break $;
    }

    if (!Object.values($appsInFullscreen).some(Boolean)) {
      $isDockHidden = false;
      break $;
    }

    $isDockHidden = Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD;
  }
</script>

<svelte:body on:mousemove={({ y }) => (mouseY = y)} />

<svelte:window bind:innerHeight={bodyHeight} />

<section
  class="dock-container"
  class:dock-hidden={$isDockHidden}
  bind:this={dockContainerEl}
  use:elevation={'dock'}
>
  <div
    class="dock-el"
    class:hidden={$isDockHidden}
    on:mousemove={(event) => (dockMouseX = event.x)}
    on:mouseleave={() => (dockMouseX = null)}
  >
    {#each Object.entries(appsConfig) as [appID, config]}
      {#if config.dockBreaksBefore}
        <div class="divider" aria-hidden="true" />
      {/if}
      <DockItem mouseX={dockMouseX} {appID} needsUpdate={$systemNeedsUpdate} />
    {/each}
  </div>
</section>

<style lang="scss">
  .dock-container {
    padding-bottom: 0.7rem;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 5.2rem;

    padding: 0.4rem;

    display: flex;
    justify-content: center;

    &:not(.dock-hidden) {
      pointer-events: none;
    }
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

    transition: transform 0.3s ease;

    &:not(.hidden) {
      pointer-events: auto;
    }

    &.hidden {
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
