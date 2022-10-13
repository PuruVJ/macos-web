<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { sineInOut } from 'svelte/easing';
  import { clickOutside, elevation, portal, trapFocus } from '🍎/actions';
  import { fadeOut } from '🍎/helpers/fade';
  import { prefersReducedMotion } from '🍎/stores/prefers-motion.store';
  import { theme } from '🍎/stores/theme.store';

  export let backdropDismiss = true;

  let isOpen: boolean;
  const dispatch = createEventDispatcher<{ open: undefined; close: string | undefined }>();

  export function open() {
    isOpen = true;
    dispatch('open');
  }

  export function close(message?: string) {
    isOpen = false;

    dispatch('close', message);

    return message;
  }

  function dialogOpenTransition(
    _: HTMLElement,
    { duration = $prefersReducedMotion ? 0 : 250 }: SvelteTransitionConfig = {},
  ): SvelteTransitionReturnType {
    return {
      duration,
      easing: sineInOut,
      css: (t) => `transform: scale(${t})`,
    };
  }
</script>

{#if isOpen}
  <section class="overlay" use:portal={'#windows-area'} use:elevation={'system-dialog'}>
    <div
      class="dialog"
      class:dark={$theme.scheme === 'dark'}
      tabindex={0}
      role="dialog"
      aria-labelledby="info-title"
      aria-describedby="info-description"
      in:dialogOpenTransition
      out:fadeOut
      use:trapFocus
      use:clickOutside={{ callback: () => backdropDismiss && close() }}
      on:click|stopPropagation={() => {}}
    >
      <slot />
    </div>
  </section>
{/if}

<style lang="scss">
  .overlay {
    position: sticky;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;

    display: grid;
    place-items: center;
  }

  .dialog {
    --elevation: 0px 2.7px 10.4px rgba(0, 0, 0, 0.124), 0px 6.5px 25px rgba(0, 0, 0, 0.178),
      0px 12.3px 47.1px rgba(0, 0, 0, 0.22), 0px 21.9px 84px rgba(0, 0, 0, 0.262),
      0px 40.9px 157.1px rgba(0, 0, 0, 0.316), 0px 98px 376px rgba(0, 0, 0, 0.44);

    padding: 1rem;

    background: hsla(var(--system-color-light-hsl), 0.6);
    backdrop-filter: blur(20px);

    will-change: transform;

    border-radius: 1rem;
    box-shadow: var(--elevation);

    &.dark {
      // border-radius: inherit;
      box-shadow: var(--elevation), inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
        0 0 0 1px hsla(var(--system-color-light-hsl), 0.5);
    }
  }
</style>
