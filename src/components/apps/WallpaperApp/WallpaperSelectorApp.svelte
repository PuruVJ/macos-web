<script lang="ts">
  import { WallpaperID, wallpapersConfig } from '🍎/configs/wallpapers/wallpaper.config';
  import { wallpaper } from '🍎/stores/wallpaper.store';

  const dynamicWallpapers = Object.entries(wallpapersConfig).filter(
    ([, { type }]) => type === 'dynamic',
  );

  const standaloneWallpapers = Object.entries(wallpapersConfig).filter(
    ([, { type }]) => type === 'standalone',
  );

  $: currentWallpaperThumb = `url(${wallpapersConfig[$wallpaper.id].thumbnail})`;

  function changeWallpaper(wallpaperName: WallpaperID) {
    $wallpaper.id = wallpaperName;
  }
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle">
    <span>Wallpapers</span>
  </header>

  <section class="main-area">
    <section class="selected-wallpaper-section">
      <div class="image" style:background-image={currentWallpaperThumb} />

      <div class="info">
        <h2>{wallpapersConfig[$wallpaper.id].name}</h2>
        <p class="wallpaper-type">{wallpapersConfig[$wallpaper.id].type} wallpaper</p>

        <br /> <br />

        {#if wallpapersConfig[$wallpaper.id].type !== 'standalone'}
          <label>
            <input type="checkbox" bind:checked={$wallpaper.canControlTheme} />
            Change dark/light mode as wallpapers change
          </label>
        {/if}
      </div>
    </section>

    <br /><br /><br /><br />

    <section class="dynamic-wallpapers">
      <h2>Dynamic Wallpapers</h2>

      <div class="wallpapers">
        {#each dynamicWallpapers as [id, { thumbnail, name }]}
          <div class="wallpaper-button">
            <button on:click={() => changeWallpaper(id)}>
              <img src={thumbnail} alt="MacOS {name} Wallpapers, dynamic" />
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
              <img src={thumbnail} alt="MacOS {name} Wallpapers, dynamic" />
            </button>
            <p>{name}</p>
          </div>
        {/each}
      </div>
    </section>
  </section>
</section>

<style lang="scss">
  h2 {
    line-height: 1.618;
    font-size: 1.618rem;

    margin: 0 0 1rem 0;
  }

  .container {
    background-color: var(--system-color-light);

    border-radius: inherit;

    display: grid;
    grid-template-rows: auto 1fr;

    min-height: auto;
    height: 100% !important;
    max-height: 100%;

    overflow-y: hidden;
  }

  .titlebar {
    display: flex;
    justify-content: center;

    padding: 0.9rem 1rem;

    width: 100%;

    border-bottom: solid 0.9px hsla(var(--system-color-dark-hsl), 0.3);

    span {
      color: hsla(var(--system-color-dark-hsl), 0.8);
      font-weight: 500;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
  }

  .main-area {
    font-size: 1rem;
    color: var(--system-color-light-contrast);

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
      background-color: hsla(var(--system-color-dark-hsl), 0.8);
      border: 6px solid transparent;
      border-radius: 16px;
      background-clip: content-box;
      transition: all 200ms;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: hsla(var(--system-color-dark-hsl), 1);
    }
  }

  .selected-wallpaper-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    .image {
      width: 30rem;
      height: auto;

      border-radius: 1rem;

      aspect-ratio: 16 / 10;

      will-change: background-image;

      transition: background-image 150ms ease-in;

      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .info {
      display: flex;
      flex-direction: column;
    }

    h2 {
      margin-bottom: 0;
    }

    .wallpaper-type {
      color: hsla(var(--system-color-dark-hsl), 0.7);
      text-transform: capitalize;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        margin-left: 0;

        height: 1.2rem;
        width: 1.2rem;

        accent-color: var(--system-color-primary);
      }
    }
  }

  .dynamic-wallpapers,
  .standalone-wallpapers {
    .wallpapers {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: 1rem;
    }
  }

  .dynamic-wallpapers .wallpaper-button button {
    aspect-ratio: 1 / 1;
  }

  .standalone-wallpapers .wallpapers {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)) !important;
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

      &:hover,
      &:focus-visible {
        img {
          box-shadow: 0 0 0 0.25rem hsla(var(--system-color-primary-hsl), 0.7);
        }
      }
    }

    img {
      width: 100%;
      height: 100%;

      object-fit: cover;

      border-radius: inherit;

      transition: box-shadow 100ms ease-in;
    }

    p {
      width: 100%;
      text-align: center;
    }
  }
</style>
