import React, { JSX, useEffect } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Text } from '@/components/text';
import { Icon, IconNames } from '../icon';

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][0];
  isFocused: boolean;
  descriptors: BottomTabBarProps['descriptors'];
  navigation: BottomTabBarProps['navigation'];
}

interface TabItemPropsWithLayout extends TabItemProps {
  onLayout: (event: LayoutChangeEvent) => void;
  totalRoutes: number;
  maxWidth: number;
}

export const TabItem = ({
  route,
  isFocused,
  descriptors,
  navigation,
  onLayout,
  totalRoutes,
  maxWidth,
}: TabItemPropsWithLayout): JSX.Element => {
  const { options } = descriptors[route.key];
  const accentColor = useCSSVariable('--color-accent') as string;
  const textColorMuted = useCSSVariable('--color-muted-foreground') as string;

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel.toString()
      : options.title !== undefined
        ? options.title.toString()
        : route.name;

  // Animated value for icon scale
  const iconScale = useSharedValue(isFocused ? 1.3 : 1);

  // Update icon scale when focus changes
  useEffect(() => {
    iconScale.value = withTiming(isFocused ? 1.3 : 1, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isFocused, iconScale]);

  // Animated style for icon
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const onPress = (): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  // Use flex: 1 when there are many items (5+) to distribute space evenly
  const shouldFlex = totalRoutes >= 5;

  return (
    <View
      className={twMerge('min-w-0 shrink', shouldFlex ? 'flex-1' : '')}
      style={{ maxWidth }}
      onLayout={onLayout}
    >
      <Clickable
        key={route.key}
        onPress={onPress}
        className="py-xs px-xs gap-xs relative h-full flex-col items-center justify-center rounded-full"
      >
        <Animated.View className="items-center" style={iconAnimatedStyle}>
          <Icon
            name={
              options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? accentColor : textColorMuted,
                size: 20,
              }) as unknown as IconNames
            }
            size="xl"
            color={isFocused ? accentColor : textColorMuted}
          />
        </Animated.View>
        <Text
          variant="labelXS"
          color={isFocused ? 'accent' : 'muted'}
          className="text-center text-xs"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </Clickable>
    </View>
  );
};
