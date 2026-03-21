import { appDefinitions } from '@/config/apps';
import { AppWindow } from './AppWindow';

export function WindowsLayer() {
  return (
    <section className="windows-layer">
      {appDefinitions
        .filter((definition) => definition.launchKind === 'window')
        .map((definition) => (
          <AppWindow appId={definition.id} key={definition.id} />
        ))}
    </section>
  );
}
