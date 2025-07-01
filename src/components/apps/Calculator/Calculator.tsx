import { mdiClose, mdiDivision, mdiMinus, mdiPercentOutline, mdiPlusMinusVariant } from '@mdi/js';
import clsx from 'clsx';
import { useReducer } from 'react';
import { AppIcon } from '__/components/utils/AppIcon';
import css from './Calculator.module.scss';
import {
  ActionT,
  CalculatorKeyT,
  calculatorReducer,
  initialState,
  IState,
} from './calculatorReducer';

const Calculator = () => {
  const [state, dispatch] = useReducer<React.Reducer<IState, ActionT>>(
    calculatorReducer,
    initialState,
  );

  const { result } = state;

  function handlePress(key: CalculatorKeyT) {
    dispatch({ type: 'Press', payload: key });
  }

  return (
    <section class={css.container}>
      <header class={clsx('app-window-drag-handle', css.header)} />
      <section class={css.showArea}>{result}</section>
      <section class={css.buttonsContainer}>
        <button class={css.topRowButton} onClick={() => handlePress('AC')}>
          {Number(result) > 0 ? 'C' : 'AC'}
        </button>
        <button class={css.topRowButton} onClick={() => handlePress('+/-')}>
          <AppIcon path={mdiPlusMinusVariant} />
        </button>
        <button class={css.topRowButton} onClick={() => handlePress('%')}>
          <AppIcon path={mdiPercentOutline} />
        </button>
        <button class={css.operationButton} onClick={() => handlePress('/')}>
          <AppIcon path={mdiDivision} />
        </button>
        <button class={css.numberButton} onClick={() => handlePress(7)}>
          7
        </button>
        <button class={css.numberButton} onClick={() => handlePress(8)}>
          8
        </button>
        <button class={css.numberButton} onClick={() => handlePress(9)}>
          9
        </button>
        <button class={css.operationButton} onClick={() => handlePress('*')}>
          <AppIcon path={mdiClose} />
        </button>
        <button class={css.numberButton} onClick={() => handlePress(4)}>
          4
        </button>
        <button class={css.numberButton} onClick={() => handlePress(5)}>
          5
        </button>
        <button class={css.numberButton} onClick={() => handlePress(6)}>
          6
        </button>
        <button class={css.operationButton} onClick={() => handlePress('-')}>
          <AppIcon path={mdiMinus} size={24} />
        </button>
        <button class={css.numberButton} onClick={() => handlePress(1)}>
          1
        </button>
        <button class={css.numberButton} onClick={() => handlePress(2)}>
          2
        </button>
        <button class={css.numberButton} onClick={() => handlePress(3)}>
          3
        </button>
        <button class={css.operationButton} onClick={() => handlePress('+')}>
          +
        </button>
        <button
          class={clsx(css.numberButton, css.curvedBottomLeftButton)}
          style={{ gridColumn: '1 / span 2' }}
          onClick={() => handlePress(0)}
        >
          0
        </button>
        <button class={css.numberButton} onClick={() => handlePress('.')}>
          .
        </button>
        <button
          class={clsx(css.operationButton, css.curvedBottomRightButton)}
          onClick={() => handlePress('=')}
        >
          =
        </button>
      </section>
    </section>
  );
};

export default Calculator;
