<script lang="ts">
  import Plus from '~icons/ic/outline-plus';
  import PlusMinusVariant from '~icons/ic/outline-plus-minus';
  import Equal from '~icons/ic/round-equals';
  import Minus from '~icons/ic/round-minus';
  import Modulo from '~icons/icon-park-outline/percentage';
  import Division from '~icons/ph/divide-bold';
  import Multiply from '~icons/uil/multiply';

  let init_value: string = "";

  const addItem = (e: string) => {
    init_value = init_value.concat(e);
  } 

  const ClearInput = () => {
    init_value = ""
  }

  const calculate = () => {
    try {
      init_value = eval(init_value).toString()
    } catch (err) {
      init_value = "Error"
      console.log(err)
    }
  }


</script>

<section class="container">
  <header class="app-window-drag-handle" />

  <section class="show-area">{init_value === "" ? "0" : init_value}</section>

  <section class="buttons-container">
    <button class="top-row-button" on:click={ClearInput} > AC </button>
    <button class="top-row-button">
      <PlusMinusVariant />
    </button>
    <button class="top-row-button" on:click={() => addItem("%")}>
      <Modulo />
    </button>
    <button class="operation-button" on:click={() => addItem("/")}>
      <Division />
    </button>
    <button class="number-button" on:click={() => addItem('7')} > 7 </button>
    <button class="number-button" on:click={() => addItem('8')}> 8 </button>
    <button class="number-button" on:click={() => addItem('9')}> 9 </button>
    <button class="operation-button" on:click={() => addItem("*")}>
      <Multiply />
    </button>
    <button class="number-button" on:click={() => addItem('4')}> 4 </button>
    <button class="number-button" on:click={() => addItem('5')}> 5 </button>
    <button class="number-button" on:click={() => addItem('6')}> 6 </button>
    <button class="operation-button" on:click={() => addItem("-")} >
      <Minus />
    </button>
    <button class="number-button"name="1" on:click={() => addItem("1")}> 1 </button>
    <button class="number-button" name="2" on:click={() => addItem("2")}> 2 </button>
    <button class="number-button" name="3" on:click={() => addItem("3")}> 3 </button>
    <button class="operation-button" name='+' on:click={() => addItem("+")}> <Plus/> </button>
    <button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" on:click={() => addItem("0")}>
      0
    </button>
    <button class="number-button" on:click={() => addItem(".")}> . </button>
    <button class="operation-button curved-bottom-right-button" on:click={calculate} > <Equal /> </button>
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

    font-family: var(--system-font-family) !important;
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

    :global(svg) {
      font-size: 1.2rem;
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
