<script lang="ts">
  import { onMount } from 'svelte';
  import { draggable } from 'svelte-drag';
  import { sineInOut } from 'svelte/easing';
  import { appsConfig } from '__/configs/apps/apps-config';
  import { randint } from '__/helpers/random';
  import { waitFor } from '__/helpers/wait-for';
  import type { AppID } from '__/stores/apps.store';
  import { activeApp, activeAppZIndex } from '__/stores/apps.store';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';
  import AppNexus from '../../apps/AppNexus.svelte';
  import TrafficLights from './TrafficLights.svelte';

  export let appID: AppID;

  let appZIndex = 0;
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

  function focusApp() {
    $activeApp = appID;
  }

  // function windowOpenTransition(
  //   el: HTMLElement,
  //   { duration = prefersReducedMotion ? 0 : 300 }: SvelteTransitionConfig,
  // ): SvelteTransitionReturnType {
  //   const { left, right, height, width } = document
  //     .querySelector(`button.dock-open-app-button.${appID}`)
  //     .getBoundingClientRect();

  //   el.style.transform = `translate()`;

  //   return {
  //     duration,
  //     easing: sineInOut,
  //     css: (t) => `opacity: ${t}; transform:  scale(${t})`,
  //   };
  // }

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
      windowEl.style.height = '100%';
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

  $: $activeApp === appID && (appZIndex = $activeAppZIndex);

  onMount(() => windowEl?.focus());
</script>

<section
  class="container"
  class:dark={$theme === 'dark'}
  style="width: {+width / 16}rem;height: {+height / 16}rem; z-index: {appZIndex}"
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={{
    defaultPosition,
    handle: '.app-window-drag-handle',
    bounds: { bottom: 84, top: 22.7, left: -600, right: -600 },
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
  <div class="tl-container {appID}">
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
    box-shadow: 0 33px 81px rgba(0, 0, 0, 0.31);

    cursor: var(--app-cursor-default), auto;

    &.dark {
      & > :global(section),
      & > :global(div) {
        border-radius: inherit;
        box-shadow: inset 0 0 0 0.9px hsla(var(--app-color-dark-hsl), 0.3),
          0 0 0 1px hsla(var(--app-color-light-hsl), 0.5);
      }
    }
  }

  .tl-container {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 1;

    // Necessary, as `.container` tries to apply shadow on it
    box-shadow: none !important;
  }
</style>
