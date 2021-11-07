<script lang="ts">
  import { onMount } from 'svelte';
  import { elevation } from '__/actions';
  import { draggable } from 'svelte-drag';
  import { sineInOut } from 'svelte/easing';
  import { appsConfig } from '__/configs/apps/apps-config';
  import { randint } from '__/helpers/random';
  import { waitFor } from '__/helpers/wait-for';
  import { activeApp, activeAppZIndex, AppID, appZIndices } from '__/stores/apps.store';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';
  import AppNexus from '../../apps/AppNexus.svelte';
  import TrafficLights from './TrafficLights.svelte';

  export let appID: AppID;

  let isBeingDragged = false;
  let draggingEnabled = true;

  let isMaximized = false;
  let minimizedTransform: string;

  let windowEl: HTMLElement;

  const { height, width } = appsConfig[appID];

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
    { duration = $prefersReducedMotion ? 0 : 300 }: SvelteTransitionConfig,
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
      windowEl.style.height = 'calc(100vh - 1.7rem - 5.25rem)';
    } else {
      draggingEnabled = true;
      windowEl.style.transform = minimizedTransform;

      windowEl.style.width = `${+width / 16}rem`;
      windowEl.style.height = `${+height / 16}rem`;
    }

    isMaximized = !isMaximized;

    await waitFor(300);

    if (!$prefersReducedMotion) windowEl.style.transition = '';
  }

  onMount(() => windowEl?.focus());
</script>

<section
  class="container"
  class:dark={$theme.scheme === 'dark'}
  style="width: {+width / 16}rem;height: {+height / 16}rem; z-index: {$appZIndices[appID]}"
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={{
    defaultPosition,
    handle: '.app-window-drag-handle',
    bounds: { bottom: -6000, top: 27.2, left: -6000, right: -6000 },
    disabled: !draggingEnabled,
    gpuAcceleration: false,
  }}
  on:svelte-drag:start={() => {
    focusApp();
    isBeingDragged = true;
  }}
  on:svelte-drag:end={() => (isBeingDragged = false)}
  on:click={focusApp}
  out:windowCloseTransition
>
  <div class="tl-container {appID}" use:elevation={'window-traffic-lights'}>
    <TrafficLights {appID} on:maximize-click={maximizeApp} />
  </div>

  <AppNexus {appID} {isBeingDragged} />
</section>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-rows: 1fr;

    position: absolute;

    will-change: width, height;

    border-radius: 0.75rem;
    box-shadow: 0px 9.9px 14.8px rgba(0, 0, 0, 0.205), 0px 79px 118px rgba(0, 0, 0, 0.41);

    cursor: var(--system-cursor-default), auto;

    &.dark {
      & > :global(section),
      & > :global(div) {
        border-radius: inherit;
        box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
          0 0 0 1px hsla(var(--system-color-light-hsl), 0.5);
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
