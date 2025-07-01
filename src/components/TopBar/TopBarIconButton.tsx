import clsx from 'clsx';
import { FC } from 'preact/compat';
import css from './TopBarIconButton.module.scss';

export const TopBarIconButton: FC<JSX.IntrinsicElements['button']> = (props) => (
  <button {...props} class={clsx(css.button, props.class)} />
);
