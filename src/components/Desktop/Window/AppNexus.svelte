<script lang="ts">
  import type { AppID } from '__/stores/apps.store';

  export let appID: AppID;
  // export let isBeingDragged: boolean;
</script>

<!-- 
{#if }
  
{/if} -->

{#await import('__/components/apps/Placeholder/Placeholder.svelte') then { default: Placeholder }}
  <Placeholder {appID} />
{/await}
