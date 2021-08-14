import { createAppConfig } from '__/helpers/create-app-config';

export const devUtilsConfig = createAppConfig({
  title: `DevUtils`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://devutils.app', '_blank'),

  dockBreaksBefore: true,
});
