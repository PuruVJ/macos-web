<script lang="ts">
  import { mdiClose, mdiDivision, mdiMinus, mdiPercentOutline, mdiPlusMinusVariant } from '@mdi/js';

  import Icon from '__/components/SVG/Icon.svelte';
</script>

<section class="container">
  <header class="app-window-drag-handle" />

  <section class="show-area">0</section>

  <section class="buttons-container">
    <button class="top-row-button"> AC </button>
    <button class="top-row-button">
      <Icon path={mdiPlusMinusVariant} />
    </button>
    <button class="top-row-button">
      <Icon path={mdiPercentOutline} />
    </button>
    <button class="operation-button">
      <icon path={mdiDivision} />
    </button>
    <button class="number-button"> 7 </button>
    <button class="number-button"> 8 </button>
    <button class="number-button"> 9 </button>
    <button class="operation-button">
      <Icon path={mdiClose} />
    </button>
    <button class="number-button"> 4 </button>
    <button class="number-button"> 5 </button>
    <button class="number-button"> 6 </button>
    <button class="operation-button">
      <Icon path={mdiMinus} size={24} />
    </button>
    <button class="number-button"> 1 </button>
    <button class="number-button"> 2 </button>
    <button class="number-button"> 3 </button>
    <button class="operation-button"> + </button>
    <button class="number-button curved-bottom-left-button" style="grid-column: 1 / span 2">
      0
    </button>
    <button class="number-button"> . </button>
    <button class="operation-button curved-bottom-right-button"> = </button>
  </section>
</section>

<style lang="scss">
  header {
    padding: 1rem;
  }

  .container {
    height: 100%;
    width: 100%;

    background-color: hsla(0, 0%, 27%, 0.7);
    backdrop-filter: blur(40px);

    border-radius: inherit;

    display: grid;
    grid-template-rows: auto auto 1fr;

    font-family: var(--app-font-family) !important;
  }

  .buttons-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 0.9px;

    margin: 1.5px;

    & > button {
      font-size: 1.618rem;
      font-weight: 300 !important;
      color: white;
      fill: white;
    }
  }

  .top-row-button {
    background-color: hsla(0, 0%, 35%, 0.6);
  }

  .number-button {
    background-color: hsla(0, 0%, 45%, 0.6);
  }

  .operation-button {
    background-color: hsla(33, 87%, 59%, 1);
  }

  .curved-bottom-left-button {
    border-radius: 0 0 0 0.7rem;
  }

  .curved-bottom-right-button {
    border-radius: 0 0 0.7rem 0;
  }

  .show-area {
    font-size: 3rem;
    color: white;
    text-align: end;
    font-weight: 200;

    overflow: auto;

    padding: 0.5rem 1rem;
  }

  :global(.tl-container.calculator) {
    top: 0.7rem;
    left: 0.7rem;
  }
</style>
