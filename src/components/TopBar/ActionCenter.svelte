<script lang="ts">
  import { mdiTransition } from '@mdi/js';
  import { onMount } from 'svelte';
  import { wallpapersConfig } from '__/configs/wallpapers/wallpaper.config';
  import { openApps } from '__/stores/apps.store';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';
  import { wallpaper } from '__/stores/wallpaper.store';
  import Icon from '../SVG/Icon.svelte';
  import MoonSvg from '../SVG/MoonSVG.svelte';
  import ActionCenterSurface from './ActionCenterSurface.svelte';
  import ActionCenterTile from './ActionCenterTile.svelte';

  export let isThemeWarningDialogOpen: boolean;

  let containerEl: HTMLElement;

  function toggleTheme() {
    if (wallpapersConfig[$wallpaper.id].type === 'dynamic' && $wallpaper.canControlTheme) {
      isThemeWarningDialogOpen = true;
      return;
    }

    $theme = $theme === 'light' ? 'dark' : 'light';
  }

  function toggleMotionPreference() {
    $prefersReducedMotion = !$prefersReducedMotion;
  }

  onMount(() => containerEl?.focus());
</script>

<section class="container" class:dark={$theme === 'dark'} tabindex={-1} bind:this={containerEl}>
  <!-- Main controls: Wifi, Bluetooth, Airdrop -->
  <ActionCenterSurface
    grid={[
      [1, 6],
      [1, 2],
    ]}
  >
    <ActionCenterTile grid={[1, 1]}>
      <button class="toggle" class:filled={$theme === 'dark'} on:click={toggleTheme}>
        <MoonSvg />
      </button>
      Dark mode
    </ActionCenterTile>
  </ActionCenterSurface>

  <ActionCenterSurface
    grid={[
      [7, 6],
      [1, 2],
    ]}
  >
    <ActionCenterTile grid={[1, 1]}>
      <button
        class="toggle"
        class:filled={!$prefersReducedMotion}
        on:click={toggleMotionPreference}
      >
        <Icon path={mdiTransition} size={16} />
      </button>
      Animations
    </ActionCenterTile>
  </ActionCenterSurface>

  <ActionCenterSurface
    grid={[
      [1, 12],
      [3, 3],
    ]}
  >
    <ActionCenterTile on:click={() => ($openApps.wallpapers = true)} grid={[1, 1]}>
      <div class="wallpaper-tile">
        <img
          class="wallpaper-thumbnail"
          src="/assets/wallpapers/{wallpapersConfig[$wallpaper.id].thumbnail}.jpg"
          alt="Current wallpaper"
        />

        <div class="wallpaper-info">
          <h3>{wallpapersConfig[$wallpaper.id].name}</h3>
          <p>{wallpapersConfig[$wallpaper.id].type} wallpaper</p>
        </div>
      </div>
    </ActionCenterTile>
  </ActionCenterSurface>
</section>

<style lang="scss">
  .container {
    --border-size: 0;

    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(1.55rem, auto);
    gap: 0.75rem;

    width: 19.5rem;

    padding: 0.75rem;

    position: relative;

    user-select: none;

    background-color: hsla(var(--app-color-light-hsl), 0.3);
    backdrop-filter: blur(12px);

    border-radius: 1rem;

    box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px,
      inset 0 0 0 var(--border-size) hsla(var(--app-color-dark-hsl), 0.3),
      0 0 0 var(--border-size) hsla(var(--app-color-light-hsl), 0.3);

    &.dark {
      --border-size: 0.5px;
    }
  }

  .toggle {
    --size: 1.7rem;

    --bgcolor: var(--app-color-dark-hsl);
    --bgalpha: 0.1;

    --svgcolor: var(--app-color-light-contrast-hsl);
    --svgalpha: 0.9;

    height: var(--size) !important;
    width: var(--size);

    padding: 0;

    display: flex;
    place-items: center;

    border-radius: 50%;

    background-color: hsla(var(--bgcolor), var(--bgalpha));

    transition: box-shadow 100ms ease, background 100ms ease;

    :global(svg) {
      fill: hsla(var(--svgcolor), var(--svgalpha));
    }

    &:focus-visible {
      box-shadow: 0 0 0 0.25rem hsla(var(--bgcolor), 0.4);
    }

    &.filled {
      --bgcolor: var(--app-color-primary-hsl);
      --bgalpha: 1;

      --svgcolor: var(--app-color-primary-contrast-hsl);
      --svgalpha: 1;
    }
  }

  .wallpaper-tile {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;

    img {
      aspect-ratio: 1 / 1;
      height: 5.1rem;

      border-radius: 0.5rem;
    }

    h3 {
      width: 100%;

      font-size: 1rem;
      line-height: 1.618;
    }

    p {
      text-transform: capitalize;
      font-size: 0.8rem;
      font-weight: 400;
    }
  }
</style>
