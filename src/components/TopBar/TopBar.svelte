<script lang="ts">
  import ActionCenterToggle from './ActionCenterToggle.svelte';
  import MenuBar from './MenuBar.svelte';
  import TopBarTime from './TopBarTime.svelte';
</script>

<header>
  <MenuBar />

  <span style="flex: 1 1 auto" />

  <ActionCenterToggle />

  <button>
    <TopBarTime />
  </button>
</header>

<style lang="scss">
  header {
    display: flex;
    align-items: center;

    width: 100%;
    height: 1.4rem;

    background-color: hsla(var(--app-color-light-hsl), 0.3);

    color: var(--app-color-light-contrast);
    fill: var(--app-color-light-contrast);

    button {
      font-weight: 500;
      font-size: 0.8rem;
      font-family: var(--app-font-family);

      letter-spacing: 0.3px;

      position: relative;

      height: 100%;

      text-shadow: 0 0 1px hsla(0, 0%, 0%, 0.1);
    }
  }

  header::before {
    content: '';

    width: inherit;
    height: inherit;

    position: fixed;
    left: 0;
    top: 0;

    z-index: 0;
    backdrop-filter: blur(12px);
  }
</style>
