<script lang="ts">
  import { appsConfig } from '__/data/apps/apps-config';
  import { activeAppZIndex, openApps } from '__/stores/apps.store';

  $: $activeAppZIndex += 2;
</script>

<section class="container">
  {#each Object.keys(appsConfig) as appID}
    {#if $openApps[appID] && appsConfig[appID].shouldOpenWindow}
      {#await import('./Window.svelte') then { default: Window }}
        <Window {appID} />
      {/await}
    {/if}
  {/each}
</section>
