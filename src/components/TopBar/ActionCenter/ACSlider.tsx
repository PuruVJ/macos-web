import { Slider, SliderProps } from '@reach/slider';
import clsx from 'clsx';
import { FC } from 'preact/compat';
import css from './ACSlider.module.scss';

export const ACSlider: FC<SliderProps> = ({ children, ...props }) => {
  return <Slider {...props} class={clsx({ [css.slider]: true })}></Slider>;
};

// const pickTrackColor = (index: number) => ['white', 'transparent'][index];

// const StyledTrack = styled.div<State>`
//   height: inherit;

//   background-color: ${({ index }) => pickTrackColor(index)};

//   border-radius: inherit;
// `;

// const StyledThumb = styled.div<State>`
//   height: var(--size);
//   width: var(--size);

//   background-color: white;

//   border-radius: 50%;

//   box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 3px 1px;

//   cursor: grab;

//   /* margin-left: calc(-1 * var(--size)); */
// `;

// interface State {
//   index: number;
//   value: number | number[];
// }
// const Track = (props: HTMLProps<HTMLDivElement>, state: State) => (
//   <div
//     {...props}
//     class={clsx({ [css.track]: true, [props.class as string]: true })}
//     style={{ '--bgcolor': pickTrackColor(state.index) } as React.CSSProperties}
//   />
// );

// const Thumb = (props: HTMLProps<HTMLDivElement>, state: State) => (
//   <div {...props} class={clsx({ [css.thumb]: true, [props.class as string]: true })} />
// );
