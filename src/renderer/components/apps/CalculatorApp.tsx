import { useState } from 'react';
import type { AppId } from '@/lib/apps';

const calculatorButtons = [
  ['AC', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
] as const;

export default function CalculatorApp(_props: { appId: AppId }) {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [replaceDisplay, setReplaceDisplay] = useState(false);

  function commitOperation(nextOperation: string) {
    const currentValue = Number(display);

    if (storedValue === null) {
      setStoredValue(currentValue);
    } else if (operation) {
      const result = calculate(storedValue, currentValue, operation);
      setStoredValue(result);
      setDisplay(String(result));
    }

    setOperation(nextOperation);
    setReplaceDisplay(true);
  }

  function handleInput(input: string) {
    if (input === 'AC') {
      setDisplay('0');
      setStoredValue(null);
      setOperation(null);
      setReplaceDisplay(false);
      return;
    }

    if (input === '+/-') {
      setDisplay(String(Number(display) * -1));
      return;
    }

    if (input === '%') {
      setDisplay(String(Number(display) / 100));
      return;
    }

    if (['/', '*', '-', '+'].includes(input)) {
      commitOperation(input);
      return;
    }

    if (input === '=') {
      if (storedValue !== null && operation) {
        const result = calculate(storedValue, Number(display), operation);
        setDisplay(String(result));
        setStoredValue(null);
        setOperation(null);
        setReplaceDisplay(true);
      }
      return;
    }

    if (input === '.') {
      if (replaceDisplay) {
        setDisplay('0.');
        setReplaceDisplay(false);
        return;
      }

      if (!display.includes('.')) {
        setDisplay(`${display}.`);
      }

      return;
    }

    setDisplay((current) => {
      if (current === '0' || replaceDisplay) {
        setReplaceDisplay(false);
        return input;
      }

      return `${current}${input}`;
    });
  }

  return (
    <div className="calculator-app">
      <div className="calculator-display">{display}</div>
      <div className="calculator-grid">
        {calculatorButtons.flatMap((row) =>
          row.map((input) => (
            <button
              className={`calculator-key ${
                ['/', '*', '-', '+', '='].includes(input) ? 'operation' : ''
              } ${['AC', '+/-', '%'].includes(input) ? 'utility' : ''} ${input === '0' ? 'wide' : ''}`}
              key={input}
              onClick={() => handleInput(input)}
              type="button"
            >
              {input}
            </button>
          )),
        )}
      </div>
    </div>
  );
}

function calculate(left: number, right: number, operation: string) {
  switch (operation) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? 0 : left / right;
    default:
      return right;
  }
}
