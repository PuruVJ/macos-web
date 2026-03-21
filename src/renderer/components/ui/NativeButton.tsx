import type { PropsWithChildren } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils/cn';

type NativeButtonProps = PropsWithChildren<
  PressableProps & {
    textClassName?: string;
  }
>;

export function NativeButton({
  children,
  className,
  textClassName,
  ...props
}: NativeButtonProps) {
  return (
    <Pressable
      {...props}
      className={cn(
        'rounded-2xl bg-white/70 px-4 py-2 shadow-sm shadow-black/10 active:opacity-80 dark:bg-white/10',
        className,
      )}
    >
      <Text className={cn('text-[13px] font-medium text-black dark:text-white', textClassName)}>
        {children}
      </Text>
    </Pressable>
  );
}
