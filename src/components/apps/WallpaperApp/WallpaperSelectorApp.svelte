<script lang="ts">
  import { WallpaperID, wallpapersConfig } from '__/configs/wallpapers/wallpaper.config';
  import { wallpaperName } from '__/stores/wallpaper.store';

  const dynamicWallpapers = Object.entries(wallpapersConfig).filter(
    ([, { type }]) => type === 'dynamic',
  );

  const standaloneWallpapers = Object.entries(wallpapersConfig).filter(
    ([, { type }]) => type === 'standalone',
  );

  function changeWallpaper(_wallpaperName: WallpaperID) {
    $wallpaperName = _wallpaperName;
  }
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />

  <section class="main-area">
    <section class="dynamic-wallpapers">
      <h2>Dynamic Wallpapers</h2>

      <div class="wallpapers">
        {#each dynamicWallpapers as [id, { thumbnail, name }]}
          <div class="wallpaper-button">
            <button on:click={() => changeWallpaper(id)}>
              <img
                src="/assets/wallpapers/{thumbnail}.jpg"
                alt="MacOS {name} Wallpapers, dynamic"
              />
            </button>
            <p>{name}</p>
          </div>
        {/each}
      </div>
    </section>

    <br /><br /><br />

    <section class="standalone-wallpapers">
      <h2>Standalone Wallpapers</h2>

      <div class="wallpapers">
        {#each standaloneWallpapers as [id, { thumbnail, name }]}
          <div class="wallpaper-button">
            <button on:click={() => changeWallpaper(id)}>
              <img
                src="/assets/wallpapers/{thumbnail}.jpg"
                alt="MacOS {name} Wallpapers, dynamic"
              />
            </button>
            <p>{name}</p>
          </div>
        {/each}
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
    font-size: 1.618rem;

    margin: 0 0 1rem 0;
  }

  .container {
    background-color: var(--app-color-light);

    border-radius: inherit;

    display: grid;
    grid-template-rows: auto 1fr;

    min-height: auto;
    height: 100% !important;
    max-height: 100%;

    overflow-y: hidden;
  }

  .titlebar {
    padding: 1.4rem 1rem;

    width: 100%;
  }

  .main-area {
    font-size: 1rem;
    color: var(--app-color-light-contrast);

    height: 100%;
    width: 100%;

    overflow-y: auto;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem;

    &::-webkit-scrollbar {
      background-color: transparent;
      width: 18px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: hsla(var(--app-color-dark-hsl), 0.8);
      border: 6px solid transparent;
      border-radius: 16px;
      background-clip: content-box;
      transition: all 200ms;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: hsla(var(--app-color-dark-hsl), 1);
    }
  }

  .dynamic-wallpapers,
  .standalone-wallpapers {
    .wallpapers {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
      gap: 1rem;
    }
  }

  .standalone-wallpapers {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }

  .wallpaper-button {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    border-radius: 0.75rem;

    button {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 10;

      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      border-radius: 0.75rem;
    }

    img {
      width: 100%;
      height: 100%;

      object-fit: cover;

      border-radius: inherit;

      transition: box-shadow 100ms ease-in;

      &:hover {
        box-shadow: 0 0 0 0.25rem hsla(var(--app-color-primary-hsl), 0.7);
      }
    }

    p {
      width: 100%;
      text-align: center;
    }
  }
</style>
