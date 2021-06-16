import { useEffect, useRef, useState } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { useTimelyWallpapers } from '__/hooks';
import { useWallpaperName } from '__/hooks/use-wallpaper-name';
import css from './Desktop.module.scss';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();

  const [wallpaperName, setWallpaperName] = useWallpaperName();

  setWallpaperName('big-sur-graphic');
  const [currWallpaperImg] = useTimelyWallpapers();

  const [wallpaper, setWallpaper] = useState('');

  useEffect(() => {
    async function main() {
      await preloadImage(`/assets/wallpapers/${currWallpaperImg}.jpg`);
      setWallpaper(currWallpaperImg);
    }
    main();
  }, [currWallpaperImg]);

  return (
    <>
      <main ref={outerRef} class={css.main}>
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <StartupChime />

      <div
        class={css.backgroundCover}
        style={{ backgroundImage: `url(/assets/wallpapers/${wallpaper}.jpg)` }}
        aria-hidden="true"
      />
    </>
  );
};

async function preloadImage(path: string) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;

    img.onload = resolve;
  });
}
