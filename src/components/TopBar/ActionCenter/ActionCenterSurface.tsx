import { ComponentChildren } from 'preact';
import css from './ActionCenterSurface.module.scss';

interface ActionCenterSurfaceProps {
  grid: [[columnStart: number, columnSpan: number], [rowStart: number, rowSpan: number]];
  children: ComponentChildren;
}

export const ActionCenterSurface = ({ grid, children }: ActionCenterSurfaceProps) => {
  const [[columnStart, columnSpan], [rowStart, rowSpan]] = grid;

  return (
    <section
      class={css.container}
      style={
        {
          '--column-start': columnStart,
          '--column-span': columnSpan,
          '--row-start': rowStart,
          '--row-span': rowSpan,
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  );
};
