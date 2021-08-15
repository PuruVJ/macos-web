import { createAppConfig } from '__/helpers/create-app-config';

const calculatorAppConfig = createAppConfig({
  title: 'Calculator',

  expandable: true,
  resizable: false,

  height: 300 * 1.414,
  width: 300,
});

const calendarAppConfig = createAppConfig({
  title: 'Calendar',
  resizable: true,
});

export const vscodeAppConfig = createAppConfig({
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,
});

export const finderAppConfig = createAppConfig({
  title: 'Finder',
  resizable: true,
});

export const safariAppConfig = createAppConfig({
  title: 'Safari',
  resizable: true,
});

export const messagesAppConfig = createAppConfig({
  title: 'Messages',
  resizable: true,
});

export const mailAppConfig = createAppConfig({
  title: 'Mail',
  resizable: true,
});

export const photosAppConfig = createAppConfig({
  title: 'Photos',
  resizable: true,
});

export const facetimeAppConfig = createAppConfig({
  title: 'Facetime',
  resizable: true,
});

export const systemPreferencesAppConfig = createAppConfig({
  title: 'System Preferences',
  resizable: true,
});

export const purusTwitterAppConfig = createAppConfig({
  title: `Puru's Twitter`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://twitter.com/puruvjdev', '_blank'),

  dockBreaksBefore: true,
});

export const viewSourceAppConfig = createAppConfig({
  title: `View Source`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://github.com/puruvj/macos-web', '_blank'),
});

export const devUtilsConfig = createAppConfig({
  title: `DevUtils`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://devutils.app', '_blank'),

  dockBreaksBefore: true,
});

export const appsConfig = {
  calculator: calculatorAppConfig,
  calendar: calendarAppConfig,
  vscode: vscodeAppConfig,
  finder: finderAppConfig,
  safari: safariAppConfig,
  messages: messagesAppConfig,
  mail: mailAppConfig,
  photos: photosAppConfig,
  facetime: facetimeAppConfig,
  'system-preferences': systemPreferencesAppConfig,

  'purus-twitter': purusTwitterAppConfig,
  'view-source': viewSourceAppConfig,

  devutils: devUtilsConfig,
};
