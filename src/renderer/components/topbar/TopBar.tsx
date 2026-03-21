import { usePreferencesStore } from '@/stores/preferencesStore';
import { ActionCenter } from './ActionCenter';
import { Clock } from './Clock';
import { MenuBar } from './MenuBar';

export function TopBar() {
  const shouldShowNotch = usePreferencesStore((state) => state.shouldShowNotch);

  return (
    <header className="topbar drag-region">
      <div className="topbar-left">
        <MenuBar />
      </div>

      {shouldShowNotch ? <div className="notch" /> : null}

      <div className="topbar-right">
        <ActionCenter />
        <button className="topbar-button no-drag" type="button">
          <Clock />
        </button>
      </div>
    </header>
  );
}
