<script lang="ts">
  import Placeholder from '__/components/apps/Placeholder/Placeholder.svelte';
  import type { AppID } from '__/stores/apps.store';

  export let appID: AppID;
  // export let isBeingDragged: boolean;
</script>

<!-- 
{#if }
  
{/if} -->

<Placeholder {appID} />
