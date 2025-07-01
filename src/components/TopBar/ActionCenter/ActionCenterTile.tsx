import { ComponentChildren } from 'preact';
import css from './ActionCenterTile.module.scss';

interface IActionCenterTileProps {
  grid: [rowStart: number, rowSpan: number];
  children: ComponentChildren;
}

export const ActionCenterTile = ({ grid, children }: IActionCenterTileProps) => {
  const [rowStart, rowsPan] = grid;

  return (
    <div
      class={css.container}
      style={{ '--row-start': rowStart, '--row-span': rowsPan } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
