<script lang="ts">
  import { clickOutside, focusOutside } from '__/actions';
  import SwitchSvg from '../utils/SwitchSVG.svelte';
  import ActionCenter from './ActionCenter.svelte';

  let visible = false;

  function show() {
    visible = true;
  }

  function hide() {
    visible = false;
  }
</script>

<div class="container" use:clickOutside={{ callback: hide }} use:focusOutside={{ callback: hide }}>
  <button on:click={show} on:focus={show}>
    <SwitchSvg />
  </button>

  {#if visible}
    <div class="menu-parent">
      <ActionCenter />
    </div>
  {/if}
</div>

<style lang="scss">
  button {
    max-height: 100%;

    margin: 0 0.7rem !important;

    :global(svg, svg path) {
      height: 1rem;
      width: 1rem;

      fill: var(--app-color-light-contrast) !important;

      position: relative;
    }
  }
</style>
