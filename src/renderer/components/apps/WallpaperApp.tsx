import { Text, View } from 'react-native';
import type { AppId } from '@/lib/apps';
import {
  dynamicWallpapers,
  standaloneWallpapers,
  wallpapers,
  type WallpaperEntry,
} from '@/config/wallpapers';
import { usePreferencesStore } from '@/stores/preferencesStore';

function WallpaperSection({
  title,
  wallpaperEntries,
}: {
  title: string;
  wallpaperEntries: WallpaperEntry[];
}) {
  const selectWallpaper = usePreferencesStore((state) => state.selectWallpaper);

  return (
    <section className="wallpaper-section">
      <h2>{title}</h2>
      <div className="wallpaper-grid">
        {wallpaperEntries.map(([wallpaperId, wallpaper]) => (
          <button
            className="wallpaper-button"
            key={wallpaperId}
            onClick={() => selectWallpaper(wallpaperId)}
            type="button"
          >
            <img alt={wallpaper.name} src={wallpaper.thumbnail} />
            <span>{wallpaper.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function WallpaperApp(_props: { appId: AppId }) {
  const currentWallpaper = usePreferencesStore((state) => state.wallpaper);
  const setWallpaperThemeControl = usePreferencesStore((state) => state.setWallpaperThemeControl);
  const wallpaperDefinition = wallpapers[currentWallpaper.id];

  return (
    <div className="wallpaper-app">
      <div className="wallpaper-current">
        <img alt={wallpaperDefinition.name} src={currentWallpaper.image} />
        <div className="wallpaper-current-copy">
          <View className="gap-1">
            <Text className="text-[30px] font-semibold text-black dark:text-white">
              {wallpaperDefinition.name}
            </Text>
            <Text className="text-[14px] capitalize text-black/60 dark:text-white/65">
              {wallpaperDefinition.type} wallpaper
            </Text>
          </View>

          {wallpaperDefinition.type === 'dynamic' ? (
            <label className="wallpaper-toggle">
              <input
                checked={currentWallpaper.canControlTheme}
                onChange={(event) => setWallpaperThemeControl(event.target.checked)}
                type="checkbox"
              />
              Change dark/light mode as wallpapers change
            </label>
          ) : null}
        </div>
      </div>

      <WallpaperSection title="Dynamic Wallpapers" wallpaperEntries={dynamicWallpapers} />
      <WallpaperSection title="Standalone Wallpapers" wallpaperEntries={standaloneWallpapers} />
    </div>
  );
}
