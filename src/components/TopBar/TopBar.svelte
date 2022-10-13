<script lang="ts">
  import { fadeIn, fadeOut } from '🍎/helpers/fade';
  import { shouldShowNotch } from '🍎/stores/menubar.store';

  import ActionCenterToggle from './ActionCenterToggle.svelte';
  import MenuBar from './MenuBar.svelte';
  import TopBarTime from './TopBarTime.svelte';
</script>

<header>
  <MenuBar />

  <span style:flex="1 1 auto" />

  {#if $shouldShowNotch}
    <div class="notch" in:fadeIn out:fadeOut>
      <span> <img src="/emojis/wink.png" alt="Wink emoji" class="emoji" /> </span>
    </div>
  {/if}

  <ActionCenterToggle />

  <button>
    <TopBarTime />
  </button>
</header>

<style lang="scss">
  header {
    display: flex;
    align-items: center;

    position: relative;

    width: 100%;
    height: 1.8rem;

    background-color: hsla(var(--system-color-light-hsl), 0.3);

    color: var(--system-color-light-contrast);
    fill: var(--system-color-light-contrast);

    button {
      font-weight: 500;
      font-size: 0.8rem;
      font-family: var(--system-font-family);

      letter-spacing: 0.3px;

      position: relative;

      height: 100%;

      text-shadow: 0 0 1px hsla(0, 0%, 0%, 0.1);
    }
  }

  .notch {
    --width: 140px;

    display: grid;
    place-items: center;

    position: absolute;
    top: 0;
    left: 50%;

    width: var(--width);
    height: 95%;

    background-color: #222;
    border-radius: 0 0 0.5rem 0.5rem;
    transform: translateX(-50%);

    & > span {
      opacity: 0;

      transition: opacity 0.2s ease-in-out;
    }

    &:hover {
      & > span {
        opacity: 1;
      }
    }

    // for outward curves
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      height: 16px;
      width: 16px;
      border-radius: 50%;
    }
    &::before {
      left: -16px;
      box-shadow: 8px -8px #222;
    }
    &::after {
      right: -16px;
      box-shadow: -8px -8px #222;
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

  .emoji {
    height: 1.5em;
    width: 1.5em;

    vertical-align: middle;
  }
</style>
