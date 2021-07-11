import { AppID } from '__/stores/apps.store';
import { lazy } from 'preact/compat';

type AppNexusProps = {
  appID: AppID;
  isBeingDragged: boolean;
};

const Calculator = lazy(() => import('./Calculator/Calculator'));
const VSCode = lazy(() => import('./VSCode/VSCode'));
const Calendar = lazy(() => import('./Calendar/Calendar'));
const SystemPreferences = lazy(() => import('./SystemPreferences/SystemPreferences'));

const PlaceholderApp = lazy(() => import('./Placeholder/Placeholder'));

export const AppNexus = ({ appID, isBeingDragged }: AppNexusProps) => {
  if (appID === 'calculator') return <Calculator />;
  if (appID === 'vscode') return <VSCode isBeingDragged={isBeingDragged} />;
  if (appID === 'calendar') return <Calendar />;
  if (appID === 'system-preferences') return <SystemPreferences />;

  return <PlaceholderApp appID={appID} />;
};
