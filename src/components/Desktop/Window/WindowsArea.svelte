<script lang="ts">
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { activeApp, activeAppZIndex, appZIndices, openApps } from '🍎/stores/apps.store';

  $: $activeApp, ($activeAppZIndex += 2);

  // Keeps all the app z indices under 50 so they don't go above the UI elements
  function normalizeAppZIndices() {
    if (!Object.values($appZIndices).some((zIndex) => zIndex > 50)) return;

    // Get the lowest non-zero z-index
    const lowestZIndex = Math.min(
      ...[...new Set(Object.values($appZIndices))].filter((val) => val !== 0),
    );

    $activeAppZIndex -= lowestZIndex;

    const keys = Object.keys($appZIndices);

    for (const app of keys) {
      if ($appZIndices[app] >= lowestZIndex) {
        $appZIndices[app] -= lowestZIndex;
      }
    }
  }

  $: $appZIndices, normalizeAppZIndices();
</script>

<section id="windows-area">
  {#each Object.keys(appsConfig) as appID}
    {#if $openApps[appID] && appsConfig[appID].shouldOpenWindow}
      {#await import('./Window.svelte') then { default: Window }}
        <Window {appID} />
      {/await}
    {/if}
  {/each}
</section>

<style lang="scss">
  section {
    display: block;

    // 1.7 rem is the heigh of the header
    // 5.25 rem is the height of dock
    // top: 1.75rem;
    height: 100%;

    width: 100vw;

    justify-self: center;
  }
</style>
