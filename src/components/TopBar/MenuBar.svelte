<script lang="ts">
  import { clickOutside } from '__/actions/click-outside';

  let containerEl: HTMLDivElement;
</script>

<div
  class="container"
  bind:this={containerEl}
  use:clickOutside={{ callback: () => console.log('Outside click') }}
>
  Hello
</div>

<style lang="scss">
  .container {
    height: 100%;

    display: flex;
    position: relative;

    height: 100%;
  }
</style>
