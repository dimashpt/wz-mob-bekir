import React, { useEffect, useMemo } from 'react';

import { usePathname } from 'expo-router';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Loader } from '@/components/loader';
import { Text } from '@/components/text';

export function UpdateButton(): React.JSX.Element | null {
  const { t } = useTranslation();
  const {
    isUpdatePending,
    isDownloading,
    downloadProgress,
    isUpdateAvailable,
  } = Updates.useUpdates();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  const progress = useMemo(
    () => Math.round((downloadProgress ?? 0) * 100),
    [downloadProgress],
  );

  // Shared value for animated bottom position
  const animatedBottom = useSharedValue(bottom + 6);

  // Calculate target bottom position
  const tabRoutes = ['/', '/attendance', '/profile'];
  const targetBottomPosition = tabRoutes.includes(pathname)
    ? bottom + 90
    : bottom + 6;

  // Animate to new position when target changes
  useEffect(() => {
    animatedBottom.value = withTiming(targetBottomPosition, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetBottomPosition, animatedBottom]);

  // Animated style for smooth bottom position transitions
  const animatedStyle = useAnimatedStyle(() => {
    return { bottom: animatedBottom.value };
  });

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <Animated.View
      className="absolute z-1000 self-center"
      style={animatedStyle}
    >
      <Clickable
        className="bg-accent gap-sm h-[50px] min-w-[50px] flex-row items-center rounded-3xl px-4 shadow-md"
        onPress={Updates.reloadAsync}
        enableHaptic
        disabled={isDownloading || !isUpdatePending}
      >
        <Loader
          spin={isDownloading}
          icon={
            <Icon
              name="refresh"
              size={20}
              className="text-foreground-inverted"
            />
          }
        />
        <Text variant="labelS" className="text-foreground-inverted">
          {isDownloading
            ? t('general.updating', { progress })
            : t('general.update_available')}
        </Text>
      </Clickable>
    </Animated.View>
  );
}
