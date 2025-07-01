import { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import css from './ActionCenterShell.module.scss';

type MenuShellProps = {
  children: ComponentChildren;
};

export const ActionCenterShell = ({ children }: MenuShellProps) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <section class={css.container} ref={ref} tabIndex={-1}>
      {children}
    </section>
  );
};
