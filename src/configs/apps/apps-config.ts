import { createAppConfig } from '__/helpers/create-app-config';

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
});

const safari = createAppConfig({
  title: 'Safari',
  resizable: true,

  height: 600,
  width: 800,
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

const devutils = createAppConfig({
  title: `DevUtils`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://devutils.app', '_blank'),

  dockBreaksBefore: true,
});

export const appsConfig = {
  safari,
  calculator,
  calendar,
  vscode,
  finder,
  messages,
  mail,
  photos,
  facetime,
  'system-preferences': systemPreferences,

  'purus-twitter': purusTwitter,
  'view-source': viewSource,

  devutils,
};
