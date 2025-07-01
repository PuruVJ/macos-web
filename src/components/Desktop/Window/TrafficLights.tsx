import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { CloseIcon } from '__/assets/traffic-icons/Close.svg';
import { GreenLightIcon } from '__/assets/traffic-icons/GreenLightIcon';
import { MinimizeIcon } from '__/assets/traffic-icons/Minimize.svg';
import { appsConfig } from '__/data/apps/apps-config';
import { activeAppStore, AppID, openAppsStore } from '__/stores/apps.store';
import css from './TrafficLights.module.scss';

type TrafficLightProps = {
  appID: AppID;
  onMaximizeClick: () => void;
  class?: string | null;
};

export const TrafficLights = ({ appID, onMaximizeClick, class: className }: TrafficLightProps) => {
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [activeApp] = useAtom(activeAppStore);

  const closeApp = () =>
    setOpenApps((openApps) => {
      openApps[appID] = false;
      return openApps;
    });

  const greenLightAction = () => {
    if (appsConfig[appID].expandable) {
      // Action not available right now!
    } else {
      onMaximizeClick();
    }
  };

  return (
    <div class={clsx(css.container, activeApp !== appID && css.unFocussed, className)}>
      <button class={css.closeLight} onClick={closeApp}>
        <CloseIcon />
      </button>
      <button class={css.minimizeLight}>
        <MinimizeIcon />
      </button>
      <button class={css.stretchLight} onClick={greenLightAction}>
        <GreenLightIcon {...appsConfig[appID]} />
      </button>
    </div>
  );
};
