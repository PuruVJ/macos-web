import clsx from 'clsx';
import css from './VSCode.module.scss';

type VSCodeProps = {
  isBeingDragged: boolean;
};

const VSCode = ({ isBeingDragged }: VSCodeProps) => {
  return (
    <section class={css.container}>
      <header class={clsx(css.header, 'app-window-drag-handle')}></header>
      <div>
        <iframe
          class={clsx(css.iframe, isBeingDragged && css.iframeDragged)}
          src="https://github1s.com/puruvj/macos-web"
        />
      </div>
    </section>
  );
};

export default VSCode;
