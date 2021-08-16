<script lang="ts">
  export let tabOpen = 'new-tab';
</script>

<section class="container" class:new-tab={tabOpen === 'new-tab'}>
  <header class="app-window-drag-handle" />
</section>

<style lang="scss">
  .container {
    background-color: hsla(var(--app-color-light-hsl), 1);
  }

  header {
    width: 100%;

    padding: 1rem;
  }
</style>
