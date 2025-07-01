import { useEffect, useRef, useState } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { LockScreen } from '../../components/LockScreen';
import css from './Desktop.module.scss';

const DarkBackground = '/assets/wallpapers/3-1.jpg';
const LightBackground = '/assets/wallpapers/3-2.jpg';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    preloadImage(DarkBackground);
    preloadImage(LightBackground);
  }, []);

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  return (
    <>
      <main ref={outerRef} class={css.main}>
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <StartupChime />

      <div class={css.backgroundCover} aria-hidden="true" />
    </>
  );
};

function preloadImage(path: string) {
  const img = new Image();
  img.src = path;
}
