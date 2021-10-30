<script lang="ts">
  import { wallpapersConfig } from '__/configs/wallpapers/wallpaper.config';
  import { smallerClosestValue } from '__/helpers/smaller-closest-value';
  import { createIntervalStore } from '__/stores/interval.store';
  import { theme } from '__/stores/theme.store';
  import { wallpaperImage, wallpaperName } from '__/stores/wallpaper.store';

  let visibleBackgroundImage = '/assets/wallpapers/37-2.jpg';

  const interval = createIntervalStore(10 * 1000);

  $: {
    $interval;

    if (wallpapersConfig[$wallpaperName].type === 'standalone') break $;

    /** Only dynamic and light/dark wallpaper logic to tackle */
    // Now check if user really wants the change to happen.

    handleTheme();
    handleWallpaper();
  }

  function handleWallpaper() {
    const date = new Date();
    const hour = date.getHours();

    const wallpaperTimestampsMap = wallpapersConfig[$wallpaperName].wallpaperTimestamps;
    const timestamps = Object.keys(wallpaperTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      if (wallpaperTimestampsMap[maxTimestamp]) {
        $wallpaperImage = wallpaperTimestampsMap[maxTimestamp];
      }

      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smallerClosestValue(timestamps, hour);

    if (wallpaperTimestampsMap[chosenTimeStamp]) {
      $wallpaperImage = wallpaperTimestampsMap[chosenTimeStamp];
    }
  }

  function handleTheme() {
    const date = new Date();
    const hour = date.getHours();

    const themeTimestampsMap = wallpapersConfig[$wallpaperName].themeTimestamps;
    const timestamps = Object.keys(themeTimestampsMap);

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    if (hour > maxTimestamp || hour < minTimestamp) {
      // Go for the min timestamp value
      $theme = 'dark';
      return;
    }

    // Now set the right timestamp
    const chosenTimeStamp = smallerClosestValue(timestamps, hour);
    $theme = themeTimestampsMap?.[chosenTimeStamp] || 'light';
  }

  function previewImageOnLoad() {
    visibleBackgroundImage = `/assets/wallpapers/${$wallpaperImage}.jpg`;
  }
</script>

<!-- These preload and render the image for browser but invisible to user -->
{#key $wallpaperImage}
  <img
    src="/assets/wallpapers/{$wallpaperImage}.jpg"
    aria-hidden="true"
    alt=""
    on:load={previewImageOnLoad}
  />
{/key}

<div class="background-cover" style="background-image: url({visibleBackgroundImage});" />

<style lang="scss">
  img {
    height: 1px;
    width: 1px;
  }

  .background-cover {
    height: 100%;
    width: 100%;

    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;

    will-change: background-image;

    transition: background-image 150ms ease-in;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    background-image: url(/assets/wallpapers/37-2.jpg);
  }
</style>
