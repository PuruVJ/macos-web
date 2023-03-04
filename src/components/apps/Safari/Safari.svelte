<script lang="ts">
  import NewTabIcon from '~icons/ic/baseline-plus';
  import TabsViewIcons from '~icons/ion/copy-outline';
  import { isValidURL, loadURL, prefixURlWithProtocol } from './safari.utils';
  import SafariSearchBox from './SafariSearchBox.svelte';

  let tabOpen = 'new-tab';

  let browsingState: 'searching' | 'idle' | 'successful' | 'error' = 'idle';

  let url = '';

  async function search(searchStr: string) {
    if (!searchStr) {
      browsingState = 'idle';
      return;
    }

    browsingState = 'searching';

    const _url = isValidURL(searchStr)
      ? prefixURlWithProtocol(searchStr)
      : `https://google.com/search?igu=1&q=${encodeURI(searchStr)}`;

    // const isLoaded = await loadURL(_url);

    // if (!isLoaded) {
    //   browsingState = 'error';
    //   return;
    // }

    url = _url;

    browsingState = 'successful';
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
    <!--  {#if browsingState === 'searching'}
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
    {/if} -->

    {#if browsingState === 'successful'}
      <iframe
        src={url}
        title="Iframe with content"
        frameborder="0"
        on:load={() => {
          browsingState = 'successful';
        }}
      />
    {/if}
  </main>
</section>

<style lang="scss">
  .container {
    display: grid;
    grid-template-rows: auto 1fr;

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

  main {
    height: 100%;
    width: calc(100% - 2px);
    margin-left: 1px;

    display: flex;
    justify-content: center;
    align-items: center;

    iframe {
      height: 100%;
      width: 100%;

      border-radius: 0 0 0.85rem 0.85rem;
    }
  }
</style>
