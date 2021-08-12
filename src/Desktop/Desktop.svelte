<script lang="ts">
  import { theme } from '__/stores/theme.store';
  import '../css/global.scss';
</script>

<main>
  <div
    class="backgroundCover"
    style="background-image: url(/assets/wallpapers/{$theme === 'dark' ? '37-1' : '37-2'}.jpg);"
  />
</main>

<style lang="scss">
  main {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  .backgroundCover {
    height: 100%;
    width: 100%;

    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;

    will-change: background-image;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
