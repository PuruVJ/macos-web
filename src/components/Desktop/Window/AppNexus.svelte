<script lang="ts">
  import type { AppID } from '__/stores/apps.store';

  export let appID: AppID;
  // export let isBeingDragged: boolean;
</script>

{#if appID === 'calendar'}
  {#await import('__/components/apps/Calendar/Calendar.svelte') then { default: Calendar }}
    <Calendar />
  {/await}
{:else}
  {#await import('__/components/apps/Placeholder/Placeholder.svelte') then { default: Placeholder }}
    <Placeholder {appID} />
  {/await}
{/if}
