<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	// Calculator state
	let display = '0';
	let previousValue = 0;
	let operation = '';
	let waitingForOperand = false;
	let pressedOperation = '';

	// Number input handler
	function inputNumber(num: string) {
		if (waitingForOperand) {
			display = num;
			waitingForOperand = false;
		} else {
			display = display === '0' ? num : display + num;
		}
	}

	// Decimal point handler
	function inputDecimal() {
		if (waitingForOperand) {
			display = '0.';
			waitingForOperand = false;
		} else if (display.indexOf('.') === -1) {
			display += '.';
		}
	}

	// Operation handler
	function performOperation(nextOperation: string) {
		const inputValue = parseFloat(display);

		if (previousValue === 0) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);

			display = formatNumber(newValue);
			previousValue = newValue;
		}

		waitingForOperand = true;
		operation = nextOperation;
		pressedOperation = nextOperation;
	}

	// Calculate function
	function calculate(firstValue: number, secondValue: number, operation: string): number {
		switch (operation) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '×':
				return firstValue * secondValue;
			case '÷':
				return secondValue === 0 ? 0 : firstValue / secondValue; // Handle division by zero
			default:
				return secondValue;
		}
	}

	// Equals handler
	function calculateResult() {
		const inputValue = parseFloat(display);

		if (previousValue !== 0 && operation) {
			const newValue = calculate(previousValue, inputValue, operation);
			display = formatNumber(newValue);
			previousValue = 0;
			operation = '';
			pressedOperation = '';
			waitingForOperand = true;
		}
	}

	// Format number for display
	function formatNumber(num: number): string {
		// Handle very large numbers
		if (Math.abs(num) > 999999999) {
			return num.toExponential(6);
		}
		// Handle very small numbers
		if (Math.abs(num) < 0.000001 && num !== 0) {
			return num.toExponential(6);
		}
		// Round to avoid floating point precision issues
		return String(Math.round(num * 100000000) / 100000000);
	}

	// Clear handler
	function clear() {
		display = '0';
		previousValue = 0;
		operation = '';
		pressedOperation = '';
		waitingForOperand = false;
	}

	// Plus/minus handler
	function toggleSign() {
		if (display !== '0') {
			display = display.charAt(0) === '-' ? display.slice(1) : '-' + display;
		}
	}

	// Percentage handler
	function percentage() {
		const value = parseFloat(display);
		display = formatNumber(value / 100);
		waitingForOperand = true;
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{display}</section>

	<section class="buttons-container">
		<button class="top-row-button" on:click={clear}> AC </button>
		<button class="top-row-button" on:click={toggleSign}>
			<PlusMinus />
		</button>
		<button class="top-row-button" on:click={percentage}> % </button>
		<button class="operation-button" class:pressed={pressedOperation === '÷'} on:click={() => performOperation('÷')}>
			<Division />
		</button>
		<button class="number-button" on:click={() => inputNumber('7')}> 7 </button>
		<button class="number-button" on:click={() => inputNumber('8')}> 8 </button>
		<button class="number-button" on:click={() => inputNumber('9')}> 9 </button>
		<button class="operation-button" class:pressed={pressedOperation === '×'} on:click={() => performOperation('×')}>
			<Multiply />
		</button>
		<button class="number-button" on:click={() => inputNumber('4')}> 4 </button>
		<button class="number-button" on:click={() => inputNumber('5')}> 5 </button>
		<button class="number-button" on:click={() => inputNumber('6')}> 6 </button>
		<button class="operation-button" class:pressed={pressedOperation === '-'} on:click={() => performOperation('-')}>
			<Minus />
		</button>
		<button class="number-button" on:click={() => inputNumber('1')}> 1 </button>
		<button class="number-button" on:click={() => inputNumber('2')}> 2 </button>
		<button class="number-button" on:click={() => inputNumber('3')}> 3 </button>
		<button class="operation-button" class:pressed={pressedOperation === '+'} on:click={() => performOperation('+')}> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" on:click={() => inputNumber('0')}>
			0
		</button>
		<button class="number-button" on:click={inputDecimal}> . </button>
		<button class="operation-button curved-bottom-right-button" on:click={calculateResult}> <Equal /> </button>
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
		transition: all 0.1s ease;
	}

	.top-row-button:hover {
		background-color: hsla(240, 5%, 12%, 0.4);
		transform: scale(1.02);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
		transition: all 0.1s ease;
	}

	.number-button:hover {
		background-color: hsla(240, 5%, 80%, 0.4);
		transform: scale(1.02);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
		transition: all 0.1s ease;
	}

	.operation-button:hover {
		background-color: hsl(37deg 98% 60%);
		transform: scale(1.02);
	}

	.operation-button.pressed {
		background-color: hsl(37deg 98% 70%);
		transform: scale(0.95);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.operation-button.pressed:hover {
		background-color: hsl(37deg 98% 75%);
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
