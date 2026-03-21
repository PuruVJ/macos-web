import { normalizeAppDefinitions, type AppDefinition, type AppId } from '@/lib/apps';

const definitions: readonly AppDefinition[] = [
  {
    id: 'finder',
    title: 'Finder',
    icon: '/app-icons/finder/256.png',
    launchKind: 'window',
    routePath: '/app/finder',
    resizable: true,
    expandable: true,
    defaultBounds: {
      width: 860,
      height: 580,
    },
  },
  {
    id: 'wallpapers',
    title: 'Wallpapers',
    icon: '/app-icons/wallpapers/256.png',
    launchKind: 'window',
    routePath: '/app/wallpapers',
    resizable: true,
    expandable: true,
    dockBreaksBefore: true,
    defaultBounds: {
      width: 960,
      height: 680,
    },
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: '/app-icons/calculator/256.png',
    launchKind: 'window',
    routePath: '/app/calculator',
    resizable: false,
    expandable: false,
    defaultBounds: {
      width: 340,
      height: 520,
    },
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: '/app-icons/calendar/256.png',
    launchKind: 'window',
    routePath: '/app/calendar',
    resizable: true,
    expandable: true,
    defaultBounds: {
      width: 900,
      height: 640,
    },
  },
  {
    id: 'vscode',
    title: 'VSCode',
    icon: '/app-icons/vscode/256.png',
    launchKind: 'window',
    routePath: '/app/vscode',
    resizable: true,
    expandable: true,
    defaultBounds: {
      width: 1024,
      height: 720,
    },
  },
  {
    id: 'appstore',
    title: 'App Store',
    icon: '/app-icons/appstore/256.png',
    launchKind: 'window',
    routePath: '/app/appstore',
    resizable: true,
    expandable: true,
    defaultBounds: {
      width: 720,
      height: 560,
    },
  },
  {
    id: 'purus-twitter',
    title: 'About the Developer',
    icon: '/app-icons/purus-twitter/256.png',
    launchKind: 'window',
    routePath: '/app/purus-twitter',
    resizable: true,
    expandable: true,
    dockBreaksBefore: true,
    defaultBounds: {
      width: 860,
      height: 620,
    },
  },
  {
    id: 'view-source',
    title: 'View Source',
    icon: '/app-icons/view-source/256.png',
    launchKind: 'external',
    href: 'https://github.com/puruvj/macos-web',
    defaultBounds: {
      width: 0,
      height: 0,
    },
    resizable: false,
    expandable: false,
  },
  {
    id: 'vercel',
    title: 'Powered by Vercel',
    icon: '/app-icons/vercel/256.webp',
    launchKind: 'external',
    href: 'https://vercel.com/?utm_source=purus-projects&utm_campaign=oss',
    dockBreaksBefore: true,
    defaultBounds: {
      width: 0,
      height: 0,
    },
    resizable: false,
    expandable: false,
  },
];

export const appDefinitions = definitions;
export const appRegistry = normalizeAppDefinitions(definitions);
export const appIds = definitions.map((definition) => definition.id);
