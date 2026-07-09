<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	// Calculator state
	let display = '0';
	let firstOperand: number | null = null;
	let operator: string | null = null;
	let waitingForSecondOperand = false;

	function inputDigit(digit: string) {
		if (waitingForSecondOperand) {
			display = digit;
			waitingForSecondOperand = false;
		} else {
			display = display === '0' ? digit : display + digit;
		}
	}

	function inputDecimal() {
		if (waitingForSecondOperand) {
			display = '0.';
			waitingForSecondOperand = false;
			return;
		}
		if (!display.includes('.')) {
			display += '.';
		}
	}

	function clearAll() {
		display = '0';
		firstOperand = null;
		operator = null;
		waitingForSecondOperand = false;
	}

	function handleOperator(nextOperator: string) {
		const inputValue = parseFloat(display);
		if (operator && waitingForSecondOperand) {
			operator = nextOperator;
			return;
		}
		if (firstOperand == null) {
			firstOperand = inputValue;
		} else if (operator) {
			const result = performCalculation(operator, firstOperand, inputValue);
			display = String(result);
			firstOperand = result;
		}
		operator = nextOperator;
		waitingForSecondOperand = true;
	}

	function performCalculation(op: string, a: number, b: number) {
		switch (op) {
			case '+': return a + b;
			case '-': return a - b;
			case '×': return a * b;
			case '÷': return b !== 0 ? a / b : 'Error';
			default: return b;
		}
	}

	function handleEquals() {
		if (operator && firstOperand != null && !waitingForSecondOperand) {
			const inputValue = parseFloat(display);
			const result = performCalculation(operator, firstOperand, inputValue);
			display = String(result);
			firstOperand = null;
			operator = null;
			waitingForSecondOperand = false;
		}
	}

	function handlePlusMinus() {
		if (display !== '0') {
			display = display.startsWith('-') ? display.slice(1) : '-' + display;
		}
	}

	function handlePercent() {
		display = String(parseFloat(display) / 100);
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{display}</section>

	<section class="buttons-container">
		<button class="top-row-button" on:click={clearAll}> AC </button>
		<button class="top-row-button" on:click={handlePlusMinus}>
			<PlusMinus />
		</button>
		<button class="top-row-button" on:click={handlePercent}> % </button>
		<button class="operation-button" on:click={() => handleOperator('÷')}>
			<Division />
		</button>
		<button class="number-button" on:click={() => inputDigit('7')}> 7 </button>
		<button class="number-button" on:click={() => inputDigit('8')}> 8 </button>
		<button class="number-button" on:click={() => inputDigit('9')}> 9 </button>
		<button class="operation-button" on:click={() => handleOperator('×')}>
			<Multiply />
		</button>
		<button class="number-button" on:click={() => inputDigit('4')}> 4 </button>
		<button class="number-button" on:click={() => inputDigit('5')}> 5 </button>
		<button class="number-button" on:click={() => inputDigit('6')}> 6 </button>
		<button class="operation-button" on:click={() => handleOperator('-')}>
			<Minus />
		</button>
		<button class="number-button" on:click={() => inputDigit('1')}> 1 </button>
		<button class="number-button" on:click={() => inputDigit('2')}> 2 </button>
		<button class="number-button" on:click={() => inputDigit('3')}> 3 </button>
		<button class="operation-button" on:click={() => handleOperator('+')}> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" on:click={() => inputDigit('0')}>
			0
		</button>
		<button class="number-button" on:click={inputDecimal}> . </button>
		<button class="operation-button curved-bottom-right-button" on:click={handleEquals}> <Equal /> </button>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}

		:global(svg) {
			font-size: 1.2rem;
		}
	}

	.top-row-button {
		background-color: hsla(240, 5%, 12%, 0.2);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
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
