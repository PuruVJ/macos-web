<script lang="ts">
  import { untrack } from 'svelte';
  import { elevation } from '🍎/actions';
  import { wallpapers_config } from '🍎/configs/wallpapers/wallpaper.config.ts';
  import { smaller_closest_value } from '🍎/helpers/smaller-closest-value.ts';
  import { create_interval } from '🍎/state/interval.svelte.ts';
  import { preferences } from '🍎/state/preferences.svelte.ts';

  let visible_background_image = $state(wallpapers_config.ventura.thumbnail);

  const interval = create_interval(5 * 1000);

  $effect(() => {
    interval.value;

    if (wallpapers_config[preferences.value.wallpaper.id].type === 'standalone') {
      untrack(
        () =>
          (preferences.value.wallpaper.image =
            wallpapers_config[preferences.value.wallpaper.id].thumbnail),
      );
      return;
    }

    /** Only dynamic and light/dark wallpaper logic to tackle */
    // Now check if user really wants the change to happen.

    untrack(handleTheme);
    untrack(handleWallpaper);
  });

  function handleWallpaper() {
    const date = new Date();
    const hour = date.getHours();

    const wallpaperTimestampsMap =
      wallpapers_config[preferences.value.wallpaper.id].timestamps.wallpaper;
    const timestamps = Object.keys(wallpaperTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      if (wallpaperTimestampsMap[maxTimestamp]) {
        preferences.value.wallpaper.image = wallpaperTimestampsMap[maxTimestamp];
      }

      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smaller_closest_value(timestamps, hour);

    if (wallpaperTimestampsMap[chosenTimeStamp]) {
      preferences.value.wallpaper.image = wallpaperTimestampsMap[chosenTimeStamp];
    }
  }

  function handleTheme() {
    if (!preferences.value.wallpaper.canControlTheme) return;

    const date = new Date();
    const hour = date.getHours();

    const themeTimestampsMap = wallpapers_config[preferences.value.wallpaper.id].timestamps.theme;
    const timestamps = Object.keys(themeTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      preferences.value.theme.scheme = 'dark';
      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smaller_closest_value(timestamps, hour);
    preferences.value.theme.scheme = themeTimestampsMap?.[chosenTimeStamp] || 'light';
  }

  function previewImageOnLoad() {
    visible_background_image = preferences.value.wallpaper.image;
  }
</script>

<!-- Prefetch all wallpapers -->
<svelte:head>
  {#each Object.values(wallpapers_config) as { thumbnail }}
    <link rel="prefetch" href={thumbnail} />
  {/each}
</svelte:head>

<!-- This preload and render the image for browser but invisible to user -->
<img
  src={preferences.value.wallpaper.image}
  aria-hidden="true"
  alt=""
  onload={previewImageOnLoad}
/>

<div
  class="background-cover"
  style:background-image="url({visible_background_image})"
  use:elevation={'wallpaper'}
></div>

<style>
  img {
    height: 1px;
    width: 1px;

    display: none;
  }

  .background-cover {
    height: 100%;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;

    will-change: background-image;

    transition: background-image 150ms ease-in;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
