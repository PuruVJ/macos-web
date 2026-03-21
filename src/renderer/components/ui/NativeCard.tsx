import type { PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { cn } from '@/lib/utils/cn';

type NativeCardProps = PropsWithChildren<ViewProps>;

export function NativeCard({ children, className, ...props }: NativeCardProps) {
  return (
    <View
      {...props}
      className={cn(
        'rounded-[24px] border border-white/40 bg-white/70 p-4 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-black/25',
        className,
      )}
    >
      {children}
    </View>
  );
}
