<script lang="ts">
  import { draggable } from '@neodrag/svelte';
  import { onMount, untrack } from 'svelte';
  import { sineInOut } from 'svelte/easing';

  import { elevation } from '🍎/actions';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { randint } from '🍎/helpers/random';
  import { waitFor } from '🍎/helpers/wait-for';
  import { apps_store, type AppID } from '🍎/state/apps.svelte';
  import { prefersReducedMotion } from '🍎/stores/prefers-motion.store';
  import { theme } from '🍎/stores/theme.store';

  import AppNexus from '../../apps/AppNexus.svelte';
  import TrafficLights from './TrafficLights.svelte';

  const { app_id }: { app_id: AppID } = $props();

  let dragging_enabled = $state(true);

  let is_maximized = $state(false);
  let minimized_transform = $state<string>();

  let windowEl = $state<HTMLElement>();

  const { height, width } = appsConfig[app_id];

  const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

  const randX = randint(-600, 600);
  const randY = randint(-100, 100);

  let defaultPosition = {
    x: (document.body.clientWidth / 2 + randX) / 2,
    y: (100 + randY) / 2,
  };

  $effect(() => {
    apps_store.active_z_index;

    if (apps_store.active === app_id) {
      untrack(() => (apps_store.z_indices[app_id] = apps_store.active_z_index));
    }
  });

  function focusApp() {
    apps_store.active = app_id;
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

    if (!is_maximized) {
      dragging_enabled = false;

      minimized_transform = windowEl.style.transform;
      windowEl.style.transform = `translate(0px, 0px)`;

      windowEl.style.width = `100%`;
      // windowEl.style.height = 'calc(100vh - 1.7rem - 5.25rem)';
      windowEl.style.height = 'calc(100vh - 1.7rem)';
    } else {
      dragging_enabled = true;
      windowEl.style.transform = minimized_transform;

      windowEl.style.width = `${+width / remModifier}rem`;
      windowEl.style.height = `${+height / remModifier}rem`;
    }

    is_maximized = !is_maximized;

    apps_store.fullscreen[app_id] = is_maximized;

    await waitFor(300);

    if (!$prefersReducedMotion) windowEl.style.transition = '';
  }

  function closeApp() {
    apps_store.open[app_id] = false;
    apps_store.fullscreen[app_id] = false;
  }

  function onAppDragStart() {
    focusApp();
    apps_store.is_being_dragged = true;
  }

  function onAppDragEnd() {
    apps_store.is_being_dragged = false;
  }

  onMount(() => windowEl?.focus());
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
  role="application"
  class="container"
  class:dark={$theme.scheme === 'dark'}
  class:active={apps_store.active === app_id}
  style:width="{+width / remModifier}rem"
  style:height="{+height / remModifier}rem"
  style:z-index={apps_store.z_indices[app_id]}
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={{
    defaultPosition,
    handle: '.app-window-drag-handle',
    bounds: { bottom: -6000, top: 27.2, left: -6000, right: -6000 },
    disabled: !dragging_enabled,
    gpuAcceleration: false,

    onDragStart: onAppDragStart,
    onDragEnd: onAppDragEnd,
  }}
  onclick={focusApp}
  onkeydown={() => {}}
  out:windowCloseTransition
>
  <div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
    <TrafficLights {app_id} on_maximize_click={maximizeApp} on_close_app={closeApp} />
  </div>

  <AppNexus {app_id} is_being_dragged={apps_store.is_being_dragged} />
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
        box-shadow:
          inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
          0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
          var(--elevated-shadow);
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
