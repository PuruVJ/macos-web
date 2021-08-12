<script lang="ts">
  import { onMount } from 'svelte';
  import Dock from '__/components/Dock/Dock.svelte';
  import TopBar from '__/components/TopBar/TopBar.svelte';
  import { theme } from '__/stores/theme.store';
  import '__/css/global.scss';
  import ContextMenu from './ContextMenu.svelte';

  const DarkBackground = '/assets/wallpapers/37-1.jpg';
  const LightBackground = '/assets/wallpapers/37-2.jpg';

  let mainEl: HTMLElement;

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

<main bind:this={mainEl}>
  <ContextMenu targetElement={mainEl} />
  <TopBar />
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
