import { createAppConfig } from '__/helpers/create-app-config';

const wallpapers = createAppConfig({
  title: 'Wallpapers',
  resizable: true,

  height: 700,
  width: 900,
});

const calculator = createAppConfig({
  title: 'Calculator',

  expandable: true,
  resizable: false,

  height: 300 * 1.414,
  width: 300,
});

const calendar = createAppConfig({
  title: 'Calendar',
  resizable: true,
});

const vscode = createAppConfig({
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,
});

const finder = createAppConfig({
  title: 'Finder',
  resizable: true,

  dockBreaksBefore: true,
});

const safari = createAppConfig({
  title: 'Safari',
  resizable: true,
});

const messages = createAppConfig({
  title: 'Messages',
  resizable: true,
});

const mail = createAppConfig({
  title: 'Mail',
  resizable: true,
});

const photos = createAppConfig({
  title: 'Photos',
  resizable: true,
});

const facetime = createAppConfig({
  title: 'Facetime',
  resizable: true,
});

const systemPreferences = createAppConfig({
  title: 'System Preferences',
  resizable: true,
});

const purusTwitter = createAppConfig({
  title: `Puru's Twitter`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://twitter.com/puruvjdev', '_blank'),

  dockBreaksBefore: true,
});

const viewSource = createAppConfig({
  title: `View Source`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://github.com/puruvj/macos-web', '_blank'),
});

const devUtils = createAppConfig({
  title: `DevUtils`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://devutils.app/?ref=puru', '_blank'),

  dockBreaksBefore: true,
});

const appstore = createAppConfig({
  title: 'App Store',
  resizable: true,
});

export const appsConfig = {
  wallpapers,
  calculator,
  calendar,
  vscode,
  finder,
  appstore,
  safari,

  'system-preferences': systemPreferences,

  'purus-twitter': purusTwitter,
  'view-source': viewSource,

  devutils: devUtils,
};
