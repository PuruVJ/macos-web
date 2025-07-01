export type OperatorT = '+' | '-' | '*' | '/';
export type DigitT = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CalculatorKeyT = DigitT | OperatorT | '+/-' | '%' | 'AC' | '=' | '.';

export enum Mode {
  InsertFirstNumber = 'InsertFirstNumber',
  InsertDecimalFirstNumber = 'InsertDecimalFirstNumber',
  OperatorPressed = 'OperatorPressed',
  InsertSecondNumber = 'InsertSecondNumber',
  InsertDecimalSecondNumber = 'InsertDecimalSecondNumber',
  ShowingResult = 'ShowingResult',
}

export interface IState {
  mode: Mode;
  firstNumber: number;
  secondNumber: number;
  operator: OperatorT | null;
  result: string;
}

export const initialState: IState = {
  mode: Mode.InsertFirstNumber,
  firstNumber: 0,
  secondNumber: 0,
  operator: null,
  result: '0',
};

export type ActionT = { type: 'Press'; payload: CalculatorKeyT };

function performJSMathResult({
  first,
  operator,
  second,
}: {
  first: number;
  operator: OperatorT;
  second: number;
}): number {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return first / second;
  }
}

function getMathResult({
  first,
  operator,
  second,
}: {
  first: number;
  operator: OperatorT;
  second: number;
}): number {
  const fractionDigits = 12;
  return Number(performJSMathResult({ first, operator, second }).toFixed(fractionDigits));
}

function isDecimal(number: number) {
  return String(number).includes('.');
}

function isOperator(value: unknown): value is OperatorT {
  return ['+', '-', '*', '/'].includes(value as OperatorT);
}

function isDigit(value: unknown): value is DigitT {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value as DigitT);
}

export function calculatorReducer(state: IState, action: ActionT): IState {
  const payload = action.payload;
  const { mode, firstNumber, secondNumber, operator, result } = state;

  const isFirstNumberInput = [
    Mode.InsertFirstNumber,
    Mode.InsertDecimalFirstNumber,
    Mode.ShowingResult,
  ].includes(mode);
  const isOperatorPressed = [Mode.OperatorPressed, Mode.ShowingResult].includes(mode);

  function getInsertedNumberResult(digit: DigitT) {
    const existingNumber = isFirstNumberInput ? firstNumber : secondNumber;

    if (isOperatorPressed) {
      return { updatedResult: `${digit}`, updatedNumber: digit };
    }

    const isDecimalMode = [Mode.InsertDecimalFirstNumber, Mode.InsertDecimalSecondNumber].includes(
      mode,
    );
    const isDecimalNumberThatEndsWithDot = isDecimalMode && !isDecimal(existingNumber);

    const updatedResult = isDecimalNumberThatEndsWithDot
      ? `${existingNumber}.${digit}`
      : `${existingNumber === 0 ? '' : existingNumber}${digit}`;

    const updatedNumber = isDecimalNumberThatEndsWithDot
      ? Number(`${existingNumber}.${digit}`)
      : Number(`${result}${digit}`);

    return { updatedResult, updatedNumber };
  }

  function getEquationResult() {
    if (operator == null) {
      return ![Mode.InsertSecondNumber, Mode.InsertDecimalSecondNumber].includes(mode)
        ? firstNumber
        : secondNumber;
    }
    return getMathResult({ first: firstNumber, second: secondNumber, operator });
  }

  if (isDigit(payload)) {
    const { updatedResult, updatedNumber } = getInsertedNumberResult(payload);

    return {
      ...state,
      mode: mode === Mode.OperatorPressed ? Mode.InsertSecondNumber : mode,
      result: updatedResult,
      ...(isFirstNumberInput ? { firstNumber: updatedNumber } : { secondNumber: updatedNumber }),
    };
  }

  if (payload === '.') {
    const isDecimalNumberMode = [
      Mode.InsertDecimalFirstNumber,
      Mode.InsertDecimalSecondNumber,
    ].includes(mode);

    if (isDecimalNumberMode) return state;
    if (mode === Mode.ShowingResult) {
      return {
        ...state,
        operator: null,
        mode: Mode.InsertDecimalFirstNumber,
        firstNumber: 0,
        result: '0.',
      };
    }

    if (mode === Mode.OperatorPressed) {
      return {
        ...state,
        mode: Mode.InsertDecimalSecondNumber,
        secondNumber: 0,
        result: '0.',
      };
    }

    return {
      ...state,
      mode: isFirstNumberInput ? Mode.InsertDecimalFirstNumber : Mode.InsertDecimalSecondNumber,
      result: isFirstNumberInput ? `${firstNumber}.` : `${secondNumber}.`,
      ...(isFirstNumberInput ? { firstNumber } : { secondNumber }),
    };
  }

  if (isOperator(payload)) {
    const isReplacingOperator = mode === Mode.OperatorPressed;
    if (isReplacingOperator) {
      return {
        ...state,
        operator: payload,
      };
    }

    const builtNumberResult = result.endsWith('.') ? result.substr(0, result.length - 1) : result;
    const updatedResult = isFirstNumberInput
      ? builtNumberResult
      : getMathResult({ first: firstNumber, second: secondNumber, operator: operator ?? payload });
    return {
      ...state,
      mode: Mode.OperatorPressed,
      operator: payload,
      firstNumber: Number(updatedResult),
      result: `${updatedResult}`,
    };
  }

  if (payload === '+/-') {
    const updatedNumber = -Number(result);
    return {
      ...state,
      ...(isFirstNumberInput ? { firstNumber: updatedNumber } : { secondNumber: updatedNumber }),
      result: `${updatedNumber}`,
    };
  }

  if (payload === '%') {
    const updatedNumber = isFirstNumberInput
      ? Number(result) / 100
      : (secondNumber / 100) * firstNumber;
    return {
      ...state,
      ...(isFirstNumberInput ? { firstNumber: updatedNumber } : { secondNumber: updatedNumber }),
      result: `${updatedNumber}`,
    };
  }

  if (payload === '=') {
    const updatedResult = getEquationResult();
    return {
      ...state,
      mode: Mode.ShowingResult,
      result: `${updatedResult}`,
      firstNumber: updatedResult,
    };
  }

  return initialState;
}
