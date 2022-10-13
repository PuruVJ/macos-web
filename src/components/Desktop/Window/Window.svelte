<script lang="ts">
  import { draggable } from '@neodrag/svelte';
  import { onMount } from 'svelte';
  import { sineInOut } from 'svelte/easing';

  import { elevation } from '🍎/actions';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { randint } from '🍎/helpers/random';
  import { waitFor } from '🍎/helpers/wait-for';
  import {
    activeApp,
    activeAppZIndex,
    AppID,
    appsInFullscreen,
    appZIndices,
    isAppBeingDragged,
    openApps,
  } from '🍎/stores/apps.store';
  import { prefersReducedMotion } from '🍎/stores/prefers-motion.store';
  import { theme } from '🍎/stores/theme.store';

  import AppNexus from '../../apps/AppNexus.svelte';
  import TrafficLights from './TrafficLights.svelte';

  export let appID: AppID;

  let draggingEnabled = true;

  let isMaximized = false;
  let minimizedTransform: string;

  let windowEl: HTMLElement;

  const { height, width } = appsConfig[appID];

  const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

  const randX = randint(-600, 600);
  const randY = randint(-100, 100);

  let defaultPosition = {
    x: (document.body.clientWidth / 2 + randX) / 2,
    y: (100 + randY) / 2,
  };

  $: $activeApp === appID && ($appZIndices[appID] = $activeAppZIndex);

  function focusApp() {
    $activeApp = appID;
  }

  function windowCloseTransition(
    el: HTMLElement,
    { duration = $prefersReducedMotion ? 0 : 300 }: SvelteTransitionConfig = {},
  ): SvelteTransitionReturnType {
    const existingTransform = getComputedStyle(el).transform;

    return {
      duration,
      easing: sineInOut,
      css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
    };
  }

  async function maximizeApp() {
    if (!$prefersReducedMotion) {
      windowEl.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.3s ease';
    }

    if (!isMaximized) {
      draggingEnabled = false;

      minimizedTransform = windowEl.style.transform;
      windowEl.style.transform = `translate(0px, 0px)`;

      windowEl.style.width = `100%`;
      // windowEl.style.height = 'calc(100vh - 1.7rem - 5.25rem)';
      windowEl.style.height = 'calc(100vh - 1.7rem)';
    } else {
      draggingEnabled = true;
      windowEl.style.transform = minimizedTransform;

      windowEl.style.width = `${+width / remModifier}rem`;
      windowEl.style.height = `${+height / remModifier}rem`;
    }

    isMaximized = !isMaximized;

    $appsInFullscreen[appID] = isMaximized;

    await waitFor(300);

    if (!$prefersReducedMotion) windowEl.style.transition = '';
  }

  function closeApp() {
    $openApps[appID] = false;
    $appsInFullscreen[appID] = false;
  }

  function onAppDragStart() {
    focusApp();
    $isAppBeingDragged = true;
  }

  function onAppDragEnd() {
    $isAppBeingDragged = false;
  }

  onMount(() => windowEl?.focus());
</script>

<section
  class="container"
  class:dark={$theme.scheme === 'dark'}
  class:active={$activeApp === appID}
  style:width="{+width / remModifier}rem"
  style:height="{+height / remModifier}rem"
  style:z-index={$appZIndices[appID]}
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={{
    defaultPosition,
    handle: '.app-window-drag-handle',
    bounds: { bottom: -6000, top: 27.2, left: -6000, right: -6000 },
    disabled: !draggingEnabled,
    gpuAcceleration: false,

    onDragStart: onAppDragStart,
    onDragEnd: onAppDragEnd,
  }}
  on:click={focusApp}
  on:keydown={() => {}}
  out:windowCloseTransition
>
  <div class="tl-container {appID}" use:elevation={'window-traffic-lights'}>
    <TrafficLights {appID} on:maximize-click={maximizeApp} on:close-app={closeApp} />
  </div>

  <AppNexus {appID} isBeingDragged={$isAppBeingDragged} />
</section>

<style lang="scss">
  .container {
    --elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

    width: 100%;
    height: 100%;

    display: grid;
    grid-template-rows: 1fr;

    position: absolute;

    will-change: width, height;

    border-radius: 0.75rem;
    box-shadow: var(--elevated-shadow);

    cursor: var(--system-cursor-default), auto;

    &.active {
      // --elevated-shadow: 0px 6.7px 12px rgba(0, 0, 0, 0.218), 0px 22.3px 40.2px rgba(0, 0, 0, 0.322),
      //   0px 100px 180px rgba(0, 0, 0, 0.54);
      --elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
    }

    &.dark {
      & > :global(section),
      & > :global(div) {
        border-radius: inherit;
        box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
          0 0 0 1px hsla(var(--system-color-light-hsl), 0.5), var(--elevated-shadow);
      }
    }
  }

  .tl-container {
    position: absolute;
    top: 1rem;
    left: 1rem;

    // Necessary, as `.container` tries to apply shadow on it
    box-shadow: none !important;
  }
</style>
