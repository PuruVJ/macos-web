<script lang="ts">
  import { onMount } from 'svelte';
  import Dock from '__/Dock/Dock.svelte';
  import { theme } from '__/stores/theme.store';
  import '../css/global.scss';

  const DarkBackground = '/assets/wallpapers/37-1.jpg';
  const LightBackground = '/assets/wallpapers/37-2.jpg';

  $: wallpaperName = $theme === 'dark' ? DarkBackground : LightBackground;

  function preloadImage(path: string) {
    const img = new Image();
    img.src = path;
  }

  onMount(() => {
    preloadImage(LightBackground);
    preloadImage(DarkBackground);
  });
</script>

<main>
  <div />
  <div />
  <Dock />
</main>

<div class="backgroundCover" style="background-image: url({wallpaperName});" />

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
