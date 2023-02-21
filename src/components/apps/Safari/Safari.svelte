<script lang="ts">
  import SafariSearchBox from './SafariSearchBox.svelte';
  import NewTabIcon from '~icons/ic/baseline-plus';
  import TabsViewIcons from '~icons/ion/copy-outline';

  let tabOpen = 'new-tab';

  let browsingState: 'searching' | 'idle' | 'successful' | 'error' = 'idle';

  function search(searchStr: string) {
    if (!searchStr) {
      browsingState = 'idle';
      return;
    }

    browsingState = 'searching';

    setTimeout(() => {
      browsingState = 'successful';
    }, 1000);
  }
</script>

<section class="container" class:opaque={browsingState !== 'idle'}>
  <header class="app-window-drag-handle">
    <span class="spacer" />

    <SafariSearchBox on:search={(e) => search(e.detail.query)} />

    <div class="buttons">
      <button><NewTabIcon font-size="1.3rem" /></button>
      <button><TabsViewIcons /></button>
    </div>
  </header>

  <main>
    {#if browsingState === 'searching'}
      <div class="searching">
        <h1>Searching...</h1>
      </div>
    {:else if browsingState === 'successful'}
      <div class="successful">
        <h1>Search successful!</h1>
      </div>
    {:else if browsingState === 'error'}
      <div class="error">
        <h1>Search error!</h1>
      </div>
    {/if}

    <!-- <iframe src="https://www.google.com/search?igu=1&q=" frameborder="0" /> -->
  </main>
</section>

<style lang="scss">
  .container {
    // background-image: url(/assets/safari-wallpapers/2.webp);
    background-position: center center;
    background-size: cover;
    backdrop-filter: blur(40px);
    background-color: hsla(var(--system-color-light-hsl), 0.7);

    color: var(--system-color-dark);

    border-radius: inherit;

    &.opaque {
      background-color: var(--system-color-light);
    }
  }

  header {
    display: grid;
    grid-template-columns: 1fr 40% 1fr;

    width: 100%;

    padding: 0.75rem 1rem;
  }

  :global(.tl-container.safari) {
    top: 1.25rem;
    left: 1.25rem;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;

    button {
      font-size: 1.1rem;
      color: hsla(var(--system-color-dark-hsl), 0.6);
    }
  }
</style>
