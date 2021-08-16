<script lang="ts">
  import { interpolate } from 'popmotion';
  import { onDestroy } from 'svelte';
  import { sineInOut } from 'svelte/easing';
  import { spring, tweened } from 'svelte/motion';
  import { appsConfig } from '__/configs/apps/apps-config';
  import type { AppID } from '__/stores/apps.store';
  import { activeApp, openApps } from '__/stores/apps.store';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';

  export let mouseX: number | null;
  export let appID: AppID;

  let imageEl: HTMLImageElement;

  const baseWidth = 57.6;
  const distanceLimit = baseWidth * 6;
  const beyondTheDistanceLimit = distanceLimit + 1;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / 1.25,
    -distanceLimit / 2,
    0,
    distanceLimit / 2,
    distanceLimit / 1.25,
    distanceLimit,
  ];
  const widthOutput = [
    baseWidth,
    baseWidth * 1.1,
    baseWidth * 1.414,
    baseWidth * 2,
    baseWidth * 1.414,
    baseWidth * 1.1,
    baseWidth,
  ];

  let distance = beyondTheDistanceLimit;

  const widthPX = spring(baseWidth, {
    damping: 0.47,
    stiffness: 0.12,
  });

  $: $widthPX = interpolate(distanceInput, widthOutput)(distance);

  let raf: number;
  function animate() {
    if (imageEl && mouseX !== null) {
      const rect = imageEl.getBoundingClientRect();

      // get the x coordinate of the img DOMElement's center
      // the left x coordinate plus the half of the width
      const imgCenterX = rect.left + rect.width / 2;

      // difference between the x coordinate value of the mouse pointer
      // and the img center x coordinate value
      const distanceDelta = mouseX - imgCenterX;
      distance = distanceDelta;
      return;
    }

    distance = beyondTheDistanceLimit;
  }

  $: {
    mouseX;
    if (!$prefersReducedMotion) {
      raf = requestAnimationFrame(animate);
    }
  }
  let { title, shouldOpenWindow, externalAction } = appsConfig[appID];

  // Spring animation for the click animation
  const appOpenIconBounceTransform = tweened(0, {
    duration: 400,
    easing: sineInOut,
  });

  async function openApp(e: MouseEvent) {
    if (!shouldOpenWindow) return externalAction?.(e);

    $openApps[appID] = true;
    $activeApp = appID;

    // Animate the icon
    await appOpenIconBounceTransform.set(-39.2);

    // Now animate it back to its place
    await appOpenIconBounceTransform.set(0);
  }

  onDestroy(() => {
    cancelAnimationFrame(raf);
  });
</script>

<button on:click={openApp} aria-label="Launch {title} app" class="dock-open-app-button {appID}">
  <p
    class="tooltip"
    class:dark={$theme === 'dark'}
    style="top: {$prefersReducedMotion ? '-50px' : '-35%'};"
  >
    {title}
  </p>
  <span style="transform: translate3d(0, {$appOpenIconBounceTransform}%, 0)">
    <img
      bind:this={imageEl}
      src="/assets/app-icons/{appID}/256.webp"
      alt="{title} app"
      style="width: {$widthPX / 16}rem"
      draggable="false"
    />
  </span>
  <div class="dot" style="--opacity: {+$openApps[appID]}" />
</button>

<style lang="scss">
  img {
    will-change: width;
  }

  button {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;

    &:hover,
    &:focus-visible {
      .tooltip {
        display: block;
      }
    }

    & > span {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .tooltip {
    --double-border: 0 0 0 0 white;

    white-space: nowrap;

    position: absolute;
    z-index: 1000;

    background-color: hsla(var(--app-color-light-hsl), 0.5);
    backdrop-filter: blur(5px);

    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;

    box-shadow: hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px, var(--double-border);

    color: var(--app-color-light-contrast);
    font-family: var(--app-font-family);
    font-weight: 400;
    font-size: 0.9rem;
    letter-spacing: 0.4px;

    display: none;

    &.dark {
      --double-border: inset 0 0 0 0.9px hsla(var(--app-color-dark-hsl), 0.3),
        0 0 0 1.2px hsla(var(--app-color-light-hsl), 0.3);
    }
  }

  .dot {
    height: 4px;
    width: 4px;

    margin: 0px;

    border-radius: 50%;

    background-color: var(--app-color-dark);

    opacity: var(--opacity);
  }
</style>
