<script lang="ts">
  import { onMount } from 'svelte';
  import { draggable } from 'svelte-drag';
  import { appsConfig } from '__/data/apps/apps-config';
  import { randint } from '__/helpers/random';
  import { activeApp, activeAppZIndex, AppID } from '__/stores/apps.store';
  import TrafficLights from './TrafficLights.svelte';

  export let appID: AppID;

  let appZIndex = 0;
  let isBeingDragged = false;

  let windowEl: HTMLElement;

  const { height, width } = appsConfig[appID];

  $: randX = randint(-600, 600);
  $: randY = randint(-100, 100);

  const defaultPosition = {
    x: ((3 / 2) * document.body.clientWidth + randX) / 2,
    y: (100 + randY) / 2,
  };

  function focusApp() {
    $activeApp = appID;
  }

  $: $activeApp === appID && (appZIndex = $activeAppZIndex);

  onMount(() => {
    windowEl?.focus();
  });
</script>

<section
  style="width: {width};height: {height}; z-index: {appZIndex}"
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={{
    defaultPosition,
    handle: 'app-window-drag-handle',
    bounds: 'parent',
  }}
  on:svelte-drag:start={() => {
    focusApp();
    isBeingDragged = true;
  }}
  on:svelte-drag:end={() => (isBeingDragged = false)}
>
  <div class="tl-container app-window-drag-handle">
    <TrafficLights {appID} />
  </div>
</section>
