<script lang="ts">
  import ExpandSvg from './ExpandSVG.svelte';
  import StretchSvg from './StretchSVG.svelte';

  export let expandable: boolean;
</script>

{#if expandable}
  <ExpandSvg />
{:else}
  <StretchSvg />
{/if}
