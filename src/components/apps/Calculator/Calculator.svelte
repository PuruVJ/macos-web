<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	let display = $state('0');
	let stored_value = $state<number>();
	let pending_operation = $state<string>();
	let reset_display = $state(false);

	function enterDigit(digit: string) {
		if (display === 'Error' || reset_display) {
			display = digit;
			reset_display = false;
			return;
		}

		display = display === '0' ? digit : `${display}${digit}`;
	}

	function enterDecimal() {
		if (display === 'Error' || reset_display) {
			display = '0.';
			reset_display = false;
		} else if (!display.includes('.')) {
			display += '.';
		}
	}

	function formatResult(value: number) {
		return Number.isFinite(value) ? Number(value.toPrecision(12)).toString() : 'Error';
	}

	function calculate(left: number, right: number, operation: string) {
		switch (operation) {
			case '+':
				return left + right;
			case '-':
				return left - right;
			case '×':
				return left * right;
			case '÷':
				return left / right;
			default:
				return right;
		}
	}

	function chooseOperation(operation: string) {
		const current_value = Number(display);
		if (!Number.isFinite(current_value)) {
			display = '0';
			stored_value = undefined;
			pending_operation = undefined;
			return;
		}

		if (pending_operation && stored_value !== undefined && !reset_display) {
			const result = calculate(stored_value, current_value, pending_operation);
			display = formatResult(result);
			stored_value = result;
		} else {
			stored_value = current_value;
		}

		pending_operation = operation;
		reset_display = true;
	}

	function equals() {
		if (pending_operation && stored_value !== undefined) {
			display = formatResult(calculate(stored_value, Number(display), pending_operation));
			stored_value = undefined;
			pending_operation = undefined;
			reset_display = true;
		}
	}

	function clear() {
		display = '0';
		stored_value = undefined;
		pending_operation = undefined;
		reset_display = false;
	}

	function toggleSign() {
		if (display !== '0' && display !== 'Error') {
			display = display.startsWith('-') ? display.slice(1) : `-${display}`;
		}
	}

	function percentage() {
		if (display !== 'Error') display = formatResult(Number(display) / 100);
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<output class="show-area" aria-live="polite" aria-label="Calculator display">{display}</output>

	<section class="buttons-container">
		<button class="top-row-button" onclick={clear}> AC </button>
		<button class="top-row-button" aria-label="Change sign" onclick={toggleSign}>
			<PlusMinus />
		</button>
		<button class="top-row-button" onclick={percentage}> % </button>
		<button class="operation-button" aria-label="Divide" onclick={() => chooseOperation('÷')}>
			<Division />
		</button>
		<button class="number-button" onclick={() => enterDigit('7')}> 7 </button>
		<button class="number-button" onclick={() => enterDigit('8')}> 8 </button>
		<button class="number-button" onclick={() => enterDigit('9')}> 9 </button>
		<button class="operation-button" aria-label="Multiply" onclick={() => chooseOperation('×')}>
			<Multiply />
		</button>
		<button class="number-button" onclick={() => enterDigit('4')}> 4 </button>
		<button class="number-button" onclick={() => enterDigit('5')}> 5 </button>
		<button class="number-button" onclick={() => enterDigit('6')}> 6 </button>
		<button class="operation-button" aria-label="Subtract" onclick={() => chooseOperation('-')}>
			<Minus />
		</button>
		<button class="number-button" onclick={() => enterDigit('1')}> 1 </button>
		<button class="number-button" onclick={() => enterDigit('2')}> 2 </button>
		<button class="number-button" onclick={() => enterDigit('3')}> 3 </button>
		<button class="operation-button" aria-label="Add" onclick={() => chooseOperation('+')}>
			<Plus />
		</button>
		<button
			class="number-button curved-bottom-left-button"
			style:grid-column="1 / span 2"
			onclick={() => enterDigit('0')}
		>
			0
		</button>
		<button class="number-button" onclick={enterDecimal}> . </button>
		<button
			class="operation-button curved-bottom-right-button"
			aria-label="Equals"
			onclick={equals}
		>
			<Equal />
		</button>
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
