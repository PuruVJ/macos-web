<script lang="ts">
  import { appsConfig } from '__/configs/apps/apps-config';
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import DockItem from './DockItem.svelte';

  // replaced dynamically
  const buildDate = '__DATE__'

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  function close() {
    needRefresh.set(false)
  }

  let mouseX: number | null = null;
</script>

<section class="dock-container">
  <div
    class="dock-el"
    on:mousemove={(event) => (mouseX = event.x)}
    on:mouseleave={() => (mouseX = null)}
  >
    {#each Object.entries(appsConfig) as [appID, config]}
      {#if config.dockBreaksBefore}
        <div class="divider" aria-hidden="true" />
      {/if}
      <DockItem {mouseX} {appID} />
    {/each}
  </div>
</section>

{#if $needRefresh}
  <div
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span>
        New content available, click on reload button to update.
      </span>
    </div>
    <button on:click={() => updateServiceWorker(true)}>
      Reload
    </button>
    <button on:click={close}>
      Close
    </button>
  </div>
{/if}

<div class='pwa-date'>{buildDate}</div>

<style lang="scss">
  .dock-container {
    margin-bottom: 0.3rem;
    left: 0;
    bottom: 0;
    z-index: 9900;
    position: fixed;

    width: 100%;
    height: 5.2rem;

    padding: 0.4rem;

    display: flex;
    justify-content: center;
  }

  .dock-el {
    background-color: hsla(var(--app-color-light-hsl), 0.4);

    box-shadow: inset 0 0 0 0.2px hsla(var(--app-color-grey-100-hsl), 0.7),
      0 0 0 0.2px hsla(var(--app-color-grey-900-hsl), 0.7), hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

    position: relative;

    padding: 0.3rem;

    border-radius: 1.2rem;

    height: 100%;

    display: flex;
    align-items: flex-end;

    &::before {
      content: '';

      border-radius: 20px;

      width: 100%;
      height: 100%;

      border: inherit;

      backdrop-filter: blur(10px);

      position: absolute;
      top: 0;
      left: 0;

      z-index: -1;
    }
  }

  .divider {
    height: 100%;
    width: 0.2px;

    background-color: hsla(var(--app-color-dark-hsl), 0.3);

    margin: 0 2px;
  }
  .pwa-date {
    visibility: hidden;
  }
  .pwa-toast {
    position: fixed;
    right: 0;
    top: 40px;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    background-color: white;
    .message {
      margin-bottom: 8px;
    }
    button {
      border: 1px solid #8885;
      outline: none;
      margin-right: 5px;
      border-radius: 2px;
      padding: 3px 10px;
    }
  }
</style>
