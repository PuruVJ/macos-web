<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';
	import { onMount } from 'svelte';

	let displayValue = '0';
  	let firstOperand = null;
  	let operator = null;
  	let waitingForSecondOperand = false;

  	function inputDigit(digit) {
		// If starting to enter the second operand, reset the display for the new value.
		if (waitingForSecondOperand === true) {
			// If the user starts with a decimal, show '0.'
			displayValue = digit === '.' ? '0.' : String(digit);
			waitingForSecondOperand = false;
			return;
		}

		// Prevent multiple decimals in the current number
		if (digit === '.' && displayValue.includes('.')) {
			return;
		}

		// If display is '0' and digit is not '.', replace it; otherwise append.
		if (displayValue === '0' && digit !== '.') {
			displayValue = String(digit);
		} else {
			displayValue = displayValue + String(digit);
		}
  	}

  	function handleOperator(nextOperator) {
		const inputValue = parseFloat(displayValue);

		// Unary operators that act immediately on the current display value
		if (nextOperator === '±') {
			// Toggle sign
			if (displayValue === '0' || displayValue === '0.0' || displayValue === '') return;
			displayValue = displayValue.startsWith('-') ? displayValue.slice(1) : '-' + displayValue;
			return;
		}

		if (nextOperator === '%') {
			// Percent: if there is a firstOperand and an operator and we're entering the second operand,
			// treat the percent as (firstOperand * current / 100). Otherwise just divide current by 100.
			let result;
			if (firstOperand !== null && operator && !waitingForSecondOperand) {
				result = (firstOperand * inputValue) / 100;
			} else {
				result = inputValue / 100;
			}
			// Normalize small floating point issues by converting to string simply
			displayValue = String(result);
			return;
		}

		// Binary operators behave as before
		if (firstOperand === null) {
			firstOperand = inputValue;
		} else if (operator) {
			const result = performCalculation[operator](firstOperand, inputValue);
			displayValue = String(result);
			firstOperand = result;
		}

		waitingForSecondOperand = true;
		operator = nextOperator;
  	}

  	const performCalculation = {
    	'/': (firstOperand, secondOperand) => (firstOperand / secondOperand).toFixed(2),
    	'*': (firstOperand, secondOperand) => (firstOperand * secondOperand).toFixed(2),
    	'+': (firstOperand, secondOperand) => (firstOperand + secondOperand).toFixed(2),
		'-': (firstOperand, secondOperand) => (firstOperand - secondOperand).toFixed(2),
		'=': (firstOperand, secondOperand) => secondOperand // For equals, just return the second operand if no previous operator
  	};

  	function resetCalculator() {
		displayValue = '0';
		firstOperand = null;
		operator = null;
		waitingForSecondOperand = false;
	}

	function handleBackspace() {
		// If we're waiting for the second operand (i.e. user just pressed an operator),
		// there's nothing typed yet to delete.
		if (waitingForSecondOperand) return;

		if (!displayValue || displayValue.length === 0) {
			displayValue = '0';
			return;
		}

		// Remove the last character
		displayValue = displayValue.slice(0, -1);

		// Normalize empty or lone '-' to '0'
		if (displayValue === '' || displayValue === '-') displayValue = '0';
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Backspace') {
			e.preventDefault();
			handleBackspace();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>


<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{displayValue.length < 8? displayValue: displayValue.substring(0,8)}</section>

	<section class="buttons-container">
		<button class="top-row-button" on:click={resetCalculator}> AC </button>
		<button class="top-row-button" on:click={() => handleOperator('±')}>
			<PlusMinus />
		</button>
		<button class="top-row-button" on:click={() => handleOperator('%')}> % </button>
		<button class="operation-button" on:click={() => handleOperator('/')}>
			<Division />
		</button>
		<button class="number-button" on:click={() => inputDigit('7')}> 7 </button>
		<button class="number-button" on:click={() => inputDigit('8')}> 8 </button>
		<button class="number-button" on:click={() => inputDigit('9')}> 9 </button>
		<button class="operation-button" on:click={() => handleOperator('*')}>
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
		<button class="number-button" on:click={() => inputDigit('.')}> . </button>
		<button class="operation-button curved-bottom-right-button" on:click={() => handleOperator('=')}> <Equal /> </button>
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
	.top-row-button:hover {
		background-color: hsl(0deg 1% 58%);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}
	.number-button:hover {
		background-color: hsl(280deg 2% 55%);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
	}
	.operation-button:hover {
		background-color: hsl(33deg 56% 98%);
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
