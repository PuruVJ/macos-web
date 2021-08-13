<script lang="ts">
  import { clickOutside, focusOutside } from '__/actions';
  import { fadeIn, fadeOut } from '__/helpers/fade';
  import SwitchSvg from '../SVG/SwitchSVG.svelte';
  import ActionCenter from './ActionCenter.svelte';

  let visible = false;

  function show() {
    visible = true;
  }

  function hide() {
    visible = false;
  }
</script>

<div
  style="height: 100%;"
  use:clickOutside={{ callback: hide }}
  use:focusOutside={{ callback: hide }}
>
  <button style="--scale: {visible ? 1 : 0};" on:click={show} on:focus={show}>
    <SwitchSvg />
  </button>

  {#if visible}
    <div in:fadeIn out:fadeOut class="menu-parent">
      <ActionCenter />
    </div>
  {/if}
</div>

<style lang="scss">
  button {
    height: 100%;
    width: max-content;

    padding: 0 0.5rem !important;

    border-radius: 0.25rem;

    position: relative;
    z-index: 1;

    &::before {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;

      height: 100%;
      width: 100%;

      border-radius: inherit;

      transform: scale(var(--scale));
      transform-origin: center center;

      transition: transform 100ms ease;

      background-color: hsla(0, 0%, 96%, 0.3);
    }

    :global(svg),
    :global(svg path) {
      height: 1rem;
      width: 1rem;

      fill: var(--app-color-light-contrast) !important;

      position: relative;
    }
  }

  .menu-parent {
    z-index: 1;
    position: absolute;
    right: 1rem;
    margin-top: 4.5px;
  }
</style>
