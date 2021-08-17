<script lang="ts">
  import Dock from '__/components/Dock/Dock.svelte';
  import TopBar from '__/components/TopBar/TopBar.svelte';
  import '__/css/global.scss';
  import { theme } from '__/stores/theme.store';
  import BoostupScreen from './BootupScreen.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import WindowsArea from './Window/WindowsArea.svelte';

  const DarkBackground = '/assets/wallpapers/37-1.jpg';
  const LightBackground = '/assets/wallpapers/37-2.jpg';

  let mainEl: HTMLElement;
</script>

<main bind:this={mainEl}>
  <BoostupScreen />

  <ContextMenu targetElement={mainEl} />

  <TopBar />
  <WindowsArea />
  <Dock />
</main>

<!-- These preload and render the image for browser but invisible to user -->
<img src={LightBackground} aria-hidden="true" alt="" />
<img src={DarkBackground} aria-hidden="true" alt="" />

<div class="backgroundCover" class:dark={$theme === 'dark'} />

<style lang="scss">
  main {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  img {
    height: 1px;
    width: 1px;
  }

  .backgroundCover {
    height: 100%;
    width: 100%;

    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;

    will-change: background-image;

    transition: background-image 150ms ease-in;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    background-image: url(/assets/wallpapers/37-2.jpg);

    &.dark {
      background-image: url(/assets/wallpapers/37-1.jpg);
    }
  }
</style>
