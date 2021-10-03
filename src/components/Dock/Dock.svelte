<script lang="ts">
  import { appsConfig } from '__/configs/apps/apps-config';
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import DockItem from './DockItem.svelte';

  // replaced dynamically
  const buildDate = '__DATE__'

  // Will store the update event, so we can use this value on AppStore to show the badge.
  // If the used clicl on Later instead Restart, the dialog is closed but the update is still there.
  // We don't need to store it on localStorage since the new sw is on skip waiting state, and so
  // a refresh or reopening the browser will prompt again the dialog to restart.
  // Once updateServiceWorker is called, there is a full reload, so the app will be loaded again.
  let needsUpdate: boolean = false

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      needsUpdate = true;
    },
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

  async function handleUpdateApp() {
    if ($needRefresh) {
      needsUpdate = false;
      updateServiceWorker();
    }
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
      <DockItem
        {mouseX}
        {appID}
        {needsUpdate}
      />
    {/each}
  </div>
</section>

{#if $needRefresh}
  <div
    class="updates-available-dialog"
    role="alert"
  >
    <div class="updates-available-hero">
      <img
        width="64"
        height="64"
        src="/assets/app-icons/system-preferences/128.webp"
        alt="AppStore app"
        draggable="false"
      />
    </div>
    <div class="updates-available-content">
      <div>
        Updates Available
      </div>
      <div>
        Do you want to restart to install these updates now or tonight?
      </div>
    </div>
    <div class='updates-available-buttons'>
      <button on:click={handleUpdateApp}>
        Restart
      </button>
      <button on:click={close}>
        Later
      </button>
    </div>
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
  .updates-available-dialog {
    position: fixed;
    right: 0;
    top: 40px;
    margin: 16px;
    border: 1px solid #8885;
    border-radius: 0.5rem;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    display: grid;
    grid-template-columns: min-content auto min-content;
    background-color: rgb(197, 219, 236);
    .updates-available-hero {
      align-self: center;
    }
    .updates-available-content {
      max-width: 19rem;
      border-right: 1px solid #e3e3e3;
      :first-child {
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0.75rem 0.5rem 0.5rem 0.5rem;;
      }
      :last-child {
        padding: 0 0.5rem 0.75rem;
      }
    }
    .updates-available-buttons {
      display: grid;
      grid-template-columns: 1fr;
      button {
        align-self: center;
        min-width: 5rem;
        height: 100%;
        border: none;
        background-color: transparent;
        outline: none;
        + button {
          border-top: 1px solid #e3e3e3;
        }
      }
    }
  }
</style>
