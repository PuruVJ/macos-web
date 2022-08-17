<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { waitFor } from '🍎/helpers/wait-for';
  import type { AppID } from '🍎/stores/apps.store';
  import { prefersReducedMotion } from '🍎/stores/prefers-motion.store';

  export let appID: AppID;

  const motionVal = spring(0, { damping: 0.28, stiffness: 0.1 });

  onMount(async () => {
    await waitFor(100);

    $motionVal = 1;
  });

  $: imageTransform = !$prefersReducedMotion
    ? `rotate(${180 * ($motionVal + 1)}deg) scale(${$motionVal}) translateZ(0px)`
    : 'initial';
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />
  <section class="main-area">
    <img style:transform={imageTransform} src="/app-icons/{appID}/256.webp" alt="Placeholder App" />

    <br />

    <h1 style:display="flex" style:align-items="center" style:gap="0.5rem">
      Nothing here yet <img
        style="height: 1em; width: auto; transform: translateY(0.1em);"
        src="/emojis/wink.png"
        alt="Wink Emoji"
      />
    </h1>
  </section>
</section>

<style lang="scss">
  .container {
    background-color: var(--system-color-light);

    border-radius: inherit;
  }

  .titlebar {
    padding: 1rem 1rem;

    width: 100%;

    position: absolute;
    top: 0;
    left: 0;
  }

  .main-area {
    font-size: 1.618rem;
    color: var(--system-color-light-contrast);

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    max-width: 8rem;
    aspect-ratio: 1 / 1;
  }
</style>
