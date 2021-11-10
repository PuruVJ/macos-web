<script lang="ts">
  import { theme } from '__/stores/theme.store';
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle">
    <span>About the Developer</span>
  </header>

  <aside class:light={$theme.scheme === 'light'}>
    <!--  -->
  </aside>

  <section class="content">
    <img
      height="200"
      width="200"
      src="/assets/app-data/purus-profile/puru.webp"
      alt="Puru Vijay Profile pic"
    />
  </section>
</section>

<style lang="scss">
  .container {
    --color: var(--system-color-light-hsl);

    display: grid;
    grid-template-columns: 12rem 1fr;
    grid-template-rows: 3rem 1fr;

    border-radius: inherit;

    background-image: linear-gradient(
      to right,
      hsla(var(--color), 0.7) 12rem,
      hsla(var(--color), 1) 12rem 100%
    );

    transition: --color 200ms ease-in;
  }

  .titlebar {
    grid-area: 1 / 1 / span 1 / span 2;

    display: flex;
    justify-content: center;

    z-index: 0;

    padding: 0.9rem 1rem;

    width: 100%;

    border-top-left-radius: inherit;
    border-top-right-radius: inherit;

    user-select: none;

    span {
      color: hsla(var(--system-color-dark-hsl), 0.8);
      font-weight: 500;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
  }

  aside {
    grid-area: 1 / 1 / span 2 / span 1;

    backdrop-filter: blur(20px);

    height: calc(100% - 3px);
    width: calc(12rem - 2.27px);

    margin: 1.7px 0 0px 1.7px;

    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: inherit;

    &.light {
      height: calc(100% - 3px);
      width: calc(12rem - 2.5px);

      margin: 1.7px 0 0px 1.7px;

      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }
  }

  .content {
    grid-area: 2 / 2 / span 1 / span 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      border-radius: 50%;
    }
  }
</style>
