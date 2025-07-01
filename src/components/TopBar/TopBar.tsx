import { ActionCenterToggle } from './ActionCenter/ActionCenterToggle';
import { MenuBar } from './menubar/MenuBar';
import css from './Topbar.module.scss';
import { TopBarTime } from './TopBarTime';

export const TopBar = () => {
  return (
    <header id="top-bar" class={css.header}>
      <MenuBar />

      <span style={{ flex: '1 1 auto' }} />

      <ActionCenterToggle />

      <button>
        <TopBarTime />
      </button>
    </header>
  );
};
