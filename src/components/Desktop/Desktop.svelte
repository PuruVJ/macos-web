<script lang="ts">
  import Dock from '🍎/components/Dock/Dock.svelte';
  import TopBar from '🍎/components/TopBar/TopBar.svelte';
  import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
  import BoostupScreen from './BootupScreen.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import WindowsArea from './Window/WindowsArea.svelte';

  let mainEl: HTMLElement;
</script>

<main bind:this={mainEl}>
  <BoostupScreen />

  <Wallpaper />

  <ContextMenu targetElement={mainEl} />

  <TopBar />
  <WindowsArea />
  <Dock />
</main>

<style lang="scss">
  main {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: auto 1fr auto;
  }
</style>
