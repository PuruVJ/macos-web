import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { NativeButton } from '@/components/ui/NativeButton';
import { NativeCard } from '@/components/ui/NativeCard';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { useSystemStore } from '@/stores/systemStore';

export function ActionCenter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const platform = useSystemStore((state) => state.platform) ?? 'desktop';
  const version = useSystemStore((state) => state.version) ?? 'dev';
  const setNeedsUpdate = useSystemStore((state) => state.setNeedsUpdate);
  const themeScheme = usePreferencesStore((state) => state.theme.scheme);
  const shouldShowNotch = usePreferencesStore((state) => state.shouldShowNotch);
  const setThemeScheme = usePreferencesStore((state) => state.setThemeScheme);
  const setShouldShowNotch = usePreferencesStore((state) => state.setShouldShowNotch);

  useOnClickOutside(containerRef, () => setOpen(false));

  return (
    <div className="action-center" ref={containerRef}>
      <button
        className="topbar-button no-drag"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Control Center
      </button>

      {open ? (
        <div className="action-center-popover no-drag">
          <NativeCard className="gap-4">
            <View className="gap-1">
              <Text className="text-[12px] uppercase tracking-[1.5px] text-black/55 dark:text-white/55">
                Host
              </Text>
              <Text className="text-[18px] font-semibold text-black dark:text-white">
                {platform} {version}
              </Text>
            </View>

            <View className="gap-3">
              <NativeButton
                className="items-center"
                onPress={() => setThemeScheme(themeScheme === 'dark' ? 'light' : 'dark')}
              >
                Switch to {themeScheme === 'dark' ? 'light' : 'dark'} mode
              </NativeButton>
              <NativeButton
                className="items-center"
                onPress={() => setShouldShowNotch(!shouldShowNotch)}
              >
                {shouldShowNotch ? 'Hide notch' : 'Show notch'}
              </NativeButton>
              <NativeButton className="items-center" onPress={() => setNeedsUpdate(true)}>
                Software Update
              </NativeButton>
            </View>
          </NativeCard>
        </div>
      ) : null}
    </div>
  );
}
