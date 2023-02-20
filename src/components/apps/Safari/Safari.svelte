<script lang="ts">
  import SafariSearchBox from './SafariSearchBox.svelte';

  let tabOpen = 'new-tab';
</script>

<section class="container">
  <header class="app-window-drag-handle">
    <SafariSearchBox />
  </header>
</section>

<style lang="scss">
  .container {
    // background-image: url(/assets/safari-wallpapers/2.webp);
    background-position: center center;
    background-size: cover;
    backdrop-filter: blur(40px);
    background-color: hsla(var(--system-color-light-hsl), 0.7);

    border-radius: inherit;
  }

  header {
    display: flex;
    justify-content: center;

    width: 100%;

    padding: 1rem;
  }
</style>
