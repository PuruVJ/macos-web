<script context="module">
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
</script>

<script lang="ts">
  import { interpolate } from 'popmotion';
  import { onDestroy } from 'svelte';
  import { sineInOut } from 'svelte/easing';
  import { spring, tweened } from 'svelte/motion';
  import { elevation } from '🍎/actions';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { AppID, isAppBeingDragged } from '🍎/stores/apps.store';
  import { activeApp, openApps } from '🍎/stores/apps.store';
  import { prefersReducedMotion } from '🍎/stores/prefers-motion.store';
  import { theme } from '🍎/stores/theme.store';

  export let mouseX: number | null;
  export let appID: AppID;
  export let needsUpdate: boolean = false;

  let imageEl: HTMLImageElement;

  let distance = beyondTheDistanceLimit;

  const widthPX = spring(baseWidth, {
    damping: 0.47,
    stiffness: 0.12,
  });

  const getWidthFromDistance = interpolate(distanceInput, widthOutput);
  $: $widthPX = getWidthFromDistance(distance);

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
    if ($prefersReducedMotion || $isAppBeingDragged) break $;

    raf = requestAnimationFrame(animate);
  }

  const { title, shouldOpenWindow, externalAction } = appsConfig[appID];

  // Spring animation for the click animation
  const appOpenIconBounceTransform = tweened(0, {
    duration: 400,
    easing: sineInOut,
  });

  async function bounceEffect() {
    // Animate the icon
    await appOpenIconBounceTransform.set(-40);

    // Now animate it back to its place
    appOpenIconBounceTransform.set(0);
  }

  async function openApp(e: MouseEvent) {
    if (!shouldOpenWindow) return externalAction?.(e);

    // For the bounce animation
    const isAppAlreadyOpen = $openApps[appID];

    $openApps[appID] = true;
    $activeApp = appID;

    if (isAppAlreadyOpen) return;

    bounceEffect();
  }

  onDestroy(() => {
    cancelAnimationFrame(raf);
  });

  $: isAppStore = appID === 'appstore';
  $: showPwaBadge = isAppStore && needsUpdate;
  $: showPwaBadge && bounceEffect();
</script>

<button on:click={openApp} aria-label="Launch {title} app" class="dock-open-app-button {appID}">
  <p
    class="tooltip"
    class:tooltip-enabled={!$isAppBeingDragged}
    class:dark={$theme.scheme === 'dark'}
    style:top={$prefersReducedMotion ? '-50px' : '-35%'}
    style:transform="translate(0, {$appOpenIconBounceTransform}px)"
    use:elevation={'dock-tooltip'}
  >
    {title}
  </p>

  <span style:transform="translate(0, {$appOpenIconBounceTransform}px)">
    <img
      bind:this={imageEl}
      src="/app-icons/{appID}/256.webp"
      alt="{title} app"
      style:width="{$widthPX / 16}rem"
      draggable="false"
    />
  </span>

  <div class="dot" style:--opacity={+$openApps[appID]} />

  {#if showPwaBadge}
    <div class="pwa-badge" style:transform="scale({$widthPX / baseWidth})">1</div>
  {/if}
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

    border-radius: 0.5rem;

    &:hover,
    &:focus-visible {
      .tooltip.tooltip-enabled {
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

    background-color: hsla(var(--system-color-light-hsl), 0.5);
    backdrop-filter: blur(5px);

    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;

    box-shadow: hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px, var(--double-border);

    color: var(--system-color-light-contrast);
    font-family: var(--system-font-family);
    font-weight: 400;
    font-size: 0.9rem;
    letter-spacing: 0.4px;

    display: none;

    &.dark {
      --double-border: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
        0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
    }
  }

  .dot {
    height: 4px;
    width: 4px;

    margin: 0px;

    border-radius: 50%;

    background-color: var(--system-color-dark);

    opacity: var(--opacity);
  }
  .pwa-badge {
    position: absolute;
    top: 1px;
    right: -1px;

    background-color: rgba(248, 58, 58, 0.85);

    box-shadow: hsla(var(--system-color-dark-hsl), 0.4) 0px 0.5px 2px;
    border-radius: 50%;

    pointer-events: none;
    vertical-align: middle;

    width: 1.5rem;
    height: 1.5rem;

    margin: 0;
    padding: 0;

    text-align: center;
    color: white;

    font-size: 1rem;
    line-height: 1.5;
  }
</style>
