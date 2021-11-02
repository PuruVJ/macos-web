<script lang="ts">
  import { sineInOut } from 'svelte/easing';
  import { portal, trapFocus } from '__/actions';
  import { prefersReducedMotion } from '__/stores/prefers-motion.store';
  import { theme } from '__/stores/theme.store';

  let isOpen: boolean;

  export let backdropDismiss = true;

  export function open() {
    isOpen = true;
  }

  export function close(message?: string) {
    isOpen = false;

    return message;
  }

  function dialogOpenTransition(
    _: HTMLElement,
    { duration = $prefersReducedMotion ? 0 : 150 }: SvelteTransitionConfig,
  ): SvelteTransitionReturnType {
    return {
      duration,
      easing: sineInOut,
      css: (t) => `transform: scale(${t})`,
    };
  }
</script>

{#if isOpen}
  <section
    use:portal={'body'}
    class="overlay"
    on:click={() => {
      backdropDismiss && close(), console.log(0);
    }}
  >
    <div
      class="dialog"
      class:dark={$theme === 'dark'}
      tabindex={0}
      role="dialog"
      aria-labelledby="info-title"
      aria-describedby="info-description"
      in:dialogOpenTransition
      use:trapFocus
      on:click|stopPropagation={() => {}}
    >
      <slot />
    </div>
  </section>
{/if}

<style lang="scss">
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    height: 100vh;
    width: 100vw;

    display: grid;
    place-items: center;
  }

  .dialog {
    --elevation: 0px 2.7px 10.4px rgba(0, 0, 0, 0.124), 0px 6.5px 25px rgba(0, 0, 0, 0.178),
      0px 12.3px 47.1px rgba(0, 0, 0, 0.22), 0px 21.9px 84px rgba(0, 0, 0, 0.262),
      0px 40.9px 157.1px rgba(0, 0, 0, 0.316), 0px 98px 376px rgba(0, 0, 0, 0.44);

    padding: 1rem;

    background: hsla(var(--app-color-light-hsl), 0.6);
    backdrop-filter: blur(30px);

    border-radius: 0.75rem;
    box-shadow: var(--elevation);

    &.dark {
      // border-radius: inherit;
      box-shadow: var(--elevation), inset 0 0 0 0.9px hsla(var(--app-color-dark-hsl), 0.3),
        0 0 0 1px hsla(var(--app-color-light-hsl), 0.5);
    }
  }
</style>
