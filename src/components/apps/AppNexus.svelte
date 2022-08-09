<script lang="ts">
  import type { AppID } from '🍎/stores/apps.store';

  export let appID: AppID;
  export let isBeingDragged: boolean;
</script>

{#if appID === 'calendar'}
  {#await import('./Calendar/Calendar.svelte') then { default: Calendar }}
    <Calendar />
  {/await}
{:else if appID === 'vscode'}
  {#await import('./VSCode/VSCode.svelte') then { default: VSCode }}
    <VSCode {isBeingDragged} />
  {/await}
{:else if appID === 'calculator'}
  {#await import('./Calculator/Calculator.svelte') then { default: Calculator }}
    <Calculator />
  {/await}
{:else if appID === 'wallpapers'}
  {#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}
    <WallpaperSelector />
  {/await}
{:else if appID === 'purus-twitter'}
  {#await import('./PurusProfile/PurusProfile.svelte') then { default: PurusProfile }}
    <PurusProfile />
  {/await}
{:else}
  {#await import('./AppStore/AppStore.svelte') then { default: AppStore }}
    <AppStore {appID} />
  {/await}
{/if}
