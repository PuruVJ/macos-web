<script lang="ts">
  import { mdiApple } from '@mdi/js';
  import { onMount } from 'svelte';
  import { fadeOut } from '__/helpers/fade';
  import { waitFor } from '__/helpers/wait-for';
  import Icon from '../utils/Icon.svelte';

  let hiddenSplashScreen = false;

  onMount(async () => {
    await waitFor(3000);
    hiddenSplashScreen = true;
  });
</script>

{#if !(hiddenSplashScreen || import.meta.env.DEV)}
  <div out:fadeOut class="splash-screen">
    <Icon path={mdiApple} fill="white" size={100} />
  </div>

  <audio hidden autoplay={import.meta.env.PROD} src="/assets/sounds/mac-startup-sound.mp3" />
{/if}

<style lang="scss">
  .splash-screen {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 999999999999;

    height: 100vh;
    width: 100vw;

    cursor: none;

    display: flex;
    justify-content: center;
    align-items: center;

    animation-fill-mode: forwards;

    background-color: #000;
  }
</style>
