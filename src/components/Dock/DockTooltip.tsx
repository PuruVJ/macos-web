import { FC } from 'preact/compat';

type IDockTooltip = {
  label: string;
};

export const DockTooltip: FC<IDockTooltip> = ({ label, children }) => {
  // const ref = useRef<HTMLDivElement>();

  return (
    <>
      {/* <Tippy
        render={() => <div class={css.box}>{label}</div>}
        trigger="focusin mouseenter"
        appendTo={document.body}
        sticky
        plugins={[sticky]}
        delay={50}
        offset={[0, 5]}
        interactive={true}
        animation={false}
        inertia={true}
        maxWidth={200}
        // DON'T REMOVE: Blurry text will be there
        popperOptions={{
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                gpuAcceleration: false,
              },
            },
          ],
        }}
      >
        {children as any}
      </Tippy>{' '} */}
      {/* <Arrow ref={ref} /> */}
    </>
  );
};

// const Arrow = styled.div`
//   visibility: hidden;

//   top: -10px;

//   &,
//   &::before {
//     --size: 0.75rem;
//     position: absolute;

//     width: var(--size);
//     height: var(--size);

//     background-color: hsla(${theme.colors.light.hsl}, 0.5);

//     border-radius: 0.1rem;
//     box-shadow: hsla(0deg, 0%, 0%, 0.3) 0px 1px 5px 2px;
//   }

//   ::before {
//     visibility: visible;
//     content: '';

//     transform: rotate(45deg);
//   }
// `;
