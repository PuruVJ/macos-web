<script lang="ts">
  import { spring } from 'svelte/motion';
  import type { AppID } from '__/stores/apps.store';

  export let appID: AppID;

  const motionVal = spring(0);
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />
  <section class="main-area">
    <img
      style="transform: rotate({0.5 * ($motionVal + 1)}turn) scale({motionVal});"
      src="/assets/app-icons/{appID}/256.webp"
      alt="Placeholder App"
    />
    <h1>Apps coming soon!</h1>
  </section>
</section>

<style lang="scss">
  .container {
    background-color: var(--app-color-light);

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
    color: var(--app-color-light-contrast);

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
