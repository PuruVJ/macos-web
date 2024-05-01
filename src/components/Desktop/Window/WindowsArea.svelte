<script lang="ts">
  import { untrack } from 'svelte';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { apps_store } from '🍎/state/apps.svelte';

  $effect(() => {
    apps_store.active;

    untrack(() => (apps_store.active_z_index += 2));
  });

  // Keeps all the app z indices under 50 so they don't go above the UI elements
  $effect(() => {
    if (!Object.values(apps_store.z_indices).some((z_index) => z_index > 50)) return;

    // Get the lowest non-zero z-index
    const lowest_z_index = Math.min(
      ...[...new Set(Object.values(apps_store.z_indices))].filter((val) => val !== 0),
    );

    untrack(() => (apps_store.active_z_index -= lowest_z_index));

    const keys = Object.keys(apps_store.z_indices);

    for (const app of keys) {
      if (apps_store.z_indices[app] >= lowest_z_index) {
        untrack(() => (apps_store.z_indices[app] -= lowest_z_index));
      }
    }
  });
</script>

<section id="windows-area">
  {#each Object.keys(appsConfig) as app_id}
    {#if apps_store.open[app_id] && appsConfig[app_id].shouldOpenWindow}
      {#await import('./Window.svelte') then { default: Window }}
        <Window {app_id} />
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
