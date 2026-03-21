import type { AppId } from '@/lib/apps';
import { Image, ScrollView, Text, View } from 'react-native';
import { NativeButton } from '@/components/ui/NativeButton';
import { NativeCard } from '@/components/ui/NativeCard';
import { appRegistry } from '@/config/apps';
import { useWindowsStore } from '@/stores/windowsStore';

const quickLaunchApps: AppId[] = ['wallpapers', 'calendar', 'calculator', 'appstore'];

type FinderAppProps = {
  appId: AppId;
};

export default function FinderApp({ appId }: FinderAppProps) {
  const openApp = useWindowsStore((state) => state.openApp);
  const focusApp = useWindowsStore((state) => state.focusApp);

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-5 p-5">
      <NativeCard className="gap-3">
        <Text className="text-[12px] uppercase tracking-[1.5px] text-black/50 dark:text-white/55">
          {appRegistry[appId].title}
        </Text>
        <Text className="text-[28px] font-semibold text-black dark:text-white">
          Welcome back to the desktop.
        </Text>
        <Text className="text-[14px] leading-6 text-black/70 dark:text-white/70">
          The Finder keeps the shell active while the rest of the apps open in their own windows.
          Use the shortcuts below to jump into the core experiences.
        </Text>
      </NativeCard>

      <View className="grid gap-4 md:grid-cols-2">
        {quickLaunchApps.map((quickAppId) => {
          const definition = appRegistry[quickAppId];

          return (
            <NativeCard className="gap-3" key={quickAppId}>
              <View className="flex-row items-center gap-3">
                <Image
                  className="h-14 w-14 rounded-2xl"
                  resizeMode="cover"
                  source={{ uri: definition.icon }}
                />
                <View className="flex-1 gap-1">
                  <Text className="text-[17px] font-semibold text-black dark:text-white">
                    {definition.title}
                  </Text>
                  <Text className="text-[13px] text-black/60 dark:text-white/65">
                    Open the {definition.title.toLowerCase()} workspace.
                  </Text>
                </View>
              </View>
              <NativeButton
                className="items-center"
                onPress={() => {
                  openApp(quickAppId);
                  focusApp(quickAppId);
                }}
              >
                Launch
              </NativeButton>
            </NativeCard>
          );
        })}
      </View>
    </ScrollView>
  );
}
