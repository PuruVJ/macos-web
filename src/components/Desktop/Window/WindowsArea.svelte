<script lang="ts">
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import { activeApp, activeAppZIndex, openApps } from '🍎/stores/apps.store';

  $: $activeApp, ($activeAppZIndex += 2);
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

    position: fixed;

    // 1.7 rem is the heigh of the header
    // 5.25 rem is the height of dock
    top: 1.75rem;
    height: calc(100vh - 5.25rem - 1.75rem);

    width: 100vw;

    justify-self: center;
  }
</style>
