import clsx from 'clsx';
import { useRef, useState } from 'preact/hooks';
import { SwitchSVG } from '__/assets/sf-icons/switch.svg';
import { useFocusOutside, useOutsideClick } from '__/hooks';
import { TopBarIconButton } from '../TopBarIconButton';
import { ActionCenter } from './ActionCenter';
import css from './ActionCenterToggle.module.scss';

export const ActionCenterToggle = () => {
  const containerRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<'visible' | 'hidden'>('hidden');

  const show = () => setState('visible');
  const hide = () => setState('hidden');

  useOutsideClick(containerRef, hide);
  useFocusOutside(containerRef, hide);

  return (
    <div class="container" ref={containerRef}>
      <span>
        <TopBarIconButton onClick={show} onFocus={show}>
          <SwitchSVG />
        </TopBarIconButton>
      </span>
      <div class={clsx(css.menuParent, state === 'hidden' && css.hidden)}>
        <ActionCenter />
      </div>
    </div>
  );
};
