<script lang="ts">
  import type { AppID } from '__/stores/apps.store';

  export let appID: AppID;
  export let isBeingDragged: boolean;
</script>

{#if appID === 'calendar'}
  {#await import('__/components/apps/Calendar/Calendar.svelte') then { default: Calendar }}
    <Calendar />
  {/await}
{:else if appID === 'vscode'}
  {#await import('__/components/apps/VSCode/VSCode.svelte') then { default: VSCode }}
    <VSCode {isBeingDragged} />
  {/await}
{:else if appID === 'calculator'}
  {#await import('__/components/apps/Calculator/Calculator.svelte') then { default: Calculator }}
    <Calculator />
  {/await}
{:else if appID === 'safari'}
  {#await import('__/components/apps/Safari/Safari.svelte') then { default: Safari }}
    <Safari />
  {/await}
{:else}
  {#await import('__/components/apps/Placeholder/Placeholder.svelte') then { default: Placeholder }}
    <Placeholder {appID} />
  {/await}
{/if}
