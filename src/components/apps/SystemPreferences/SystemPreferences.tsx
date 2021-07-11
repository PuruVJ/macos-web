import { WallpaperSwitcher } from './WallpaperSwitcher/WallpaperSwitcher';
import css from './SystemPreferences.module.scss';
import clsx from 'clsx';

export const SystemPreferences = () => {
  return (
    <section class={css.container}>
      <header class={clsx('app-window-drag-handle', css.header)}></header>
      <WallpaperSwitcher />
    </section>
  );
};

export default SystemPreferences;
