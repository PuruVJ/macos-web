<script lang="ts">
  import { mdiBluetooth, mdiTransition, mdiWifiStrength4 } from '@mdi/js';
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';
  import AirDropSvg from '../SVG/AirDropSVG.svelte';
  import Icon from '../SVG/Icon.svelte';
  import MoonSvg from '../SVG/MoonSVG.svelte';
  import ActionCenterSurface from './ActionCenterSurface.svelte';
  import ActionCenterTile from './ActionCenterTile.svelte';

  let containerEl: HTMLDivElement;

  function toggleTheme() {
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
      [1, 4],
    ]}
  >
    <ActionCenterTile grid={[1, 1]}>
      <button class="toggle" class:filled={!0}>
        <Icon path={mdiWifiStrength4} size={16} />
      </button>
      Wi-Fi
    </ActionCenterTile>

    <ActionCenterTile grid={[2, 1]}>
      <button class="toggle" class:filled={!0}>
        <Icon path={mdiBluetooth} size={18} />
      </button>
      Bluetooth
    </ActionCenterTile>

    <ActionCenterTile grid={[3, 1]}>
      <button class="toggle" class:filled={!!0}>
        <AirDropSvg />
      </button>
      Airdrop
    </ActionCenterTile>
  </ActionCenterSurface>

  <!-- Theme Switcher -->
  <ActionCenterSurface
    grid={[
      [7, 6],
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

  <!-- Motion Preference -->
  <ActionCenterSurface
    grid={[
      [7, 6],
      [3, 2],
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
</style>
