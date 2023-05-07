<script lang="ts">
  import { theme } from '🍎/stores/theme.store';


</script>

<section class="container">
  <header class="titlebar app-window-drag-handle">
    Finder
  </header>
  
  <aside class:light={$theme.scheme === 'light'}>
    <nav>
      <p>Favourites</p>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Recent.webp" alt="recent"> Recent </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/AirDrop.webp" alt="airdrop"> AirDrop </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Desktop.webp" alt="desktop"> Desktop </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Documents.webp" alt="documents"> Documents </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Pictures.webp" alt="pictures"> Pictures </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Downloads.webp" alt="downloads"> Downloads </a>

      <hr />
      <p>Locations</p>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Drive.webp" alt="drive"> Macintosh HD </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a><img src="/Finder-side-bar-icons/Folder.webp" alt="folder"> macOS Web </a>
    </nav>
  </aside>
  <section class="content">
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

    color: var(--system-color-dark);
  }

  .titlebar {
    grid-area: 1 / 1 / span 1 / span 2;

    display: flex;
    justify-content: center;

    z-index: 1;

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

    transform: translateZ(0);

    height: calc(100% - 2.7px);
    width: calc(12rem - 2.27px);

    margin: 1.8px 0 0px 1.8px;

    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: inherit;

    &::before {
      content: '';

      width: inherit;
      height: inherit;

      border-radius: inherit;

      position: fixed;
      left: 0;
      top: 0;

      z-index: -1;
      backdrop-filter: blur(12px);
    }

    &.light {
      height: calc(100% - 3px);
      width: calc(12rem - 2.5px);

      margin: 1.7px 0 0px 1.7px;

      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      margin: 3rem 0.6rem;

      hr {
        display: block;

        width: 100%;
        height: 1px;

        background-color: hsla(var(--system-color-dark-hsl), 0.2);

        border: none;
      }

      a {
        display: flex;
        gap: 0.4rem;
        align-items: center;

        color: hsla(var(--system-color-dark-hsl), 0.9);
        text-decoration: none;
        font-weight: 400;

        padding: 0.5rem 0.5rem;

        border-radius: 0.4rem;

        transition: background-color 100ms ease;

        &:hover {
          background-color: hsla(var(--system-color-dark-hsl), 0.2);
        }
      }
    }
  }

  .content {
    border-top: solid 0.9px hsla(var(--system-color-dark-hsl), 0.3);
    grid-area: 2 / 2 / span 1 / span 1;

    display: flex;
    flex-direction: row;
    align-items: left;

    padding: 1rem;

    img {
      border-radius: 50%;
    }
  }

  .emoji {
    height: 1em;
    width: 1em;

    vertical-align: middle;
  }

  h1 {
    font-size: 2.618rem;
    line-height: 1.618;
  }

  h2 {
    font-size: 1.618rem;
    line-height: 1.2;
  }

  p {
    font-size: 90%;
    color: rgb(105, 103, 103);
  }

</style>
