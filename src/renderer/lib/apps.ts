export type AppId =
  | 'finder'
  | 'wallpapers'
  | 'calculator'
  | 'calendar'
  | 'vscode'
  | 'appstore'
  | 'purus-twitter'
  | 'view-source'
  | 'vercel';

export type LaunchKind = 'window' | 'external';

export type AppDefinition = {
  id: AppId;
  title: string;
  icon: string;
  launchKind: LaunchKind;
  routePath?: `/app/${string}`;
  href?: string;
  resizable: boolean;
  expandable: boolean;
  defaultBounds: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  dockBreaksBefore?: boolean;
  initiallyOpen?: boolean;
};

export function normalizeAppDefinitions(definitions: readonly AppDefinition[]) {
  return definitions.reduce(
    (registry, definition) => {
      registry[definition.id] = definition;
      return registry;
    },
    {} as Record<AppId, AppDefinition>,
  );
}

export function isWindowApp(definition: AppDefinition) {
  return definition.launchKind === 'window';
}
