<script lang="ts">
  import Dock from '🍎/components/Dock/Dock.svelte';
  import TopBar from '🍎/components/TopBar/TopBar.svelte';
  import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
  import BootupScreen from './BootupScreen.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import SystemUpdate from './SystemUpdate.svelte';
  import WindowsArea from './Window/WindowsArea.svelte';

  let mainEl: HTMLElement;
</script>

<div bind:this={mainEl} class="container">
  <main>
    <TopBar />
    <WindowsArea />
    <Dock />
  </main>

  <Wallpaper />
  <BootupScreen />
  <SystemUpdate />

  <ContextMenu targetElement={mainEl} />
</div>

<style lang="scss">
  .container {
    height: 100%;
    width: 100%;
  }

  main {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: auto 1fr auto;
  }
</style>
