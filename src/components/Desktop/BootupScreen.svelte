<script lang="ts">
  import { mdiApple } from '@mdi/js';
  import { onMount } from 'svelte';
  import { quintInOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { fadeOut } from '__/helpers/fade';
  import { waitFor } from '__/helpers/wait-for';
  import Icon from '../SVG/Icon.svelte';

  let hiddenSplashScreen = false;
  let progressVal = tweened(100, { duration: 3000, easing: quintInOut });
  let updateApp: boolean | undefined;

  onMount(async () => {
    try {
      updateApp = localStorage.getItem<boolean>("pwa:update");
    }
    catch (_) {
      updateApp = false;
    }
    finally {
      if (updateApp) {
        try {
          localStorage.removeItem("pwa:update");
        } catch (_) {}
      }
    }
    $progressVal = 0;
    await waitFor(3000);
    hiddenSplashScreen = true;
  });
</script>

{#if !(hiddenSplashScreen || import.meta.env.DEV)}
  <div out:fadeOut={{ duration: 500 }} class="splash-screen">
    <Icon path={mdiApple} fill="white" size={100} />

    <div
      class="progress"
      role="progressbar"
      aria-valuenow={100 - $progressVal}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext="Loading up macOS Web"
    >
      <div class="indicator" style="transform: translateX(-{$progressVal}%);" />
    </div>
  </div>
{/if}

<audio hidden autoplay={import.meta.env.PROD && !updateApp} src="/assets/sounds/mac-startup-sound.mp3" />

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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    animation-fill-mode: forwards;

    background-color: #000;
  }

  .progress {
    border-radius: 50px;

    height: 4px;
    width: 150px;

    overflow-x: hidden;

    background-color: var(--app-color-grey-800);
  }

  .indicator {
    background-color: var(--app-color-grey-100);

    border-radius: inherit;

    width: 100%;
    height: 100%;

    transform: translateX(-0%);
  }
</style>
