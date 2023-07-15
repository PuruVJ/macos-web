import { createAppConfig } from '🍎/helpers/create-app-config';

const wallpapers = createAppConfig({
  title: 'Wallpapers',
  resizable: true,

  height: 600,
  width: 800,

  dockBreaksBefore: true,
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

const notes = createAppConfig({
  title: 'Notes',
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

  // dockBreaksBefore: true,
  shouldOpenWindow: true,
});

const purusTwitter = createAppConfig({
  title: `About the Developer`,
  resizable: true,

  dockBreaksBefore: true,

  height: 600,
  width: 800,
});

const viewSource = createAppConfig({
  title: `View Source`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://github.com/puruvj/macos-web', '_blank'),
});

const ukraine = createAppConfig({
  title: `Support Ukraine`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://www.stopputin.net/', '_blank'),

  dockBreaksBefore: true,
});

const vercel = createAppConfig({
  title: `Powered by Vercel`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () =>
    window.open('https://vercel.com/?utm_source=purus-projects&utm_campaign=oss', '_blank'),

  dockBreaksBefore: true,
});

const appstore = createAppConfig({
  title: 'App Store',
  resizable: true,
});

export const appsConfig = {
  finder,
  wallpapers,
  calculator,
  calendar,
  notes,
  vscode,
  appstore,
  // safari,

  // 'system-preferences': systemPreferences,

  'purus-twitter': purusTwitter,
  'view-source': viewSource,

  vercel,

  ukraine,
};
