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

  let hidden: boolean = !import.meta.env.PROD;
  let autoplay: boolean = !!import.meta.env.PROD;

  onMount(async () => {
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

<!-- iframe => firefox support: will always make sound available on start or F5 -->
<iframe
  id="audio"
  src="/assets/sounds/mac-startup-sound.mp3"
  type="audio/mp3"
  allow="autoplay"
  hidden
  title=""
/>

<!-- the audio will not autoplay on chrome based browsers: requires some user interaction -->
<!-- see https://developer.chrome.com/blog/autoplay/ for a more detailed explanation -->
<!-- unless you install the PWA on the desktop, in that case will always be played  -->
<!-- it will always sound when the restart for system update clicked, we have user interaction  -->
<audio id="player" {hidden} {autoplay} controls>
  <source src="/assets/sounds/mac-startup-sound.mp3" />
</audio>

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
  #audio,
  #player {
    position: absolute;
    z-index: -9999;
  }
</style>
