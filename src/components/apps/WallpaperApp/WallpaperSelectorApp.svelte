<section class="container">
  <header class="titlebar app-window-drag-handle" />
  <section class="main-area">
    <section class="dynamic-wallpapers">
      <h2>Dynamic Wallpapers</h2>
      <div class="wallpapers">
        <button class="wallpaper-button">
          <img src="/assets/wallpapers/37-2.jpg" alt="MacOS Monterey Wallpapers, dynamic" />
        </button>

        <button class="wallpaper-button">
          <img src="/assets/wallpapers/3-2.jpg" alt="MacOS Big Sur Wallpapers, dynamic" />
        </button>

        <button class="wallpaper-button">
          <img src="/assets/wallpapers/24-2.jpg" alt="MacOS Catalina Wallpapers, dynamic" />
        </button>
      </div>
    </section>
  </section>
</section>

<style lang="scss">
  // h1 {
  //   font-size: 2.2rem;
  //   line-height: 1.618;

  //   margin: 0 0 1rem 0;
  // }

  h2 {
    line-height: 1.618;

    margin: 0 0 1rem 0;
  }

  .container {
    background-color: var(--app-color-light);

    border-radius: inherit;
  }

  .titlebar {
    padding: 1rem 1rem;

    width: 100%;
  }

  .main-area {
    font-size: 1.618rem;
    color: var(--app-color-light-contrast);

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem;
  }

  .dynamic-wallpapers .wallpapers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: 1rem;
  }

  .wallpaper-button {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;

    border-radius: 0.75rem;

    transition: box-shadow 100ms ease-in;

    &:hover {
      box-shadow: 0 0 0 0.25rem hsla(var(--app-color-primary-hsl), 0.7);
    }

    img {
      width: 100%;
      height: 100%;

      object-fit: cover;

      border-radius: inherit;
    }
  }
</style>
