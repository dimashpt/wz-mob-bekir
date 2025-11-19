import React, { JSX, useEffect } from 'react';
import { LayoutChangeEvent, useWindowDimensions, View } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Text } from '@/components/text';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { Icon, IconNames } from '../icon';

const MappedLinearGradient = withUniwind(LinearGradient);

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][0];
  isFocused: boolean;
  descriptors: BottomTabBarProps['descriptors'];
  navigation: BottomTabBarProps['navigation'];
}

interface TabItemPropsWithLayout extends TabItemProps {
  onLayout: (event: LayoutChangeEvent) => void;
  totalRoutes: number;
}

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element => {
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const backgroundColor = useCSSVariable('--color-background') as string;
  const accentColor = useCSSVariable('--color-accent') as string;

  // Shared values for dot indicator position
  const dotX = useSharedValue(0);
  const dotY = useSharedValue(0);

  // Store layout measurements for each tab
  const tabLayouts = React.useRef<
    Record<number, { x: number; centerX: number }>
  >({});

  function handleTabLayout(index: number) {
    return (event: LayoutChangeEvent): void => {
      const { x, width } = event.nativeEvent.layout;
      const centerX = x + width / 2;
      tabLayouts.current[index] = { x, centerX };

      // Initialize dot position on first layout
      if (index === state.index) {
        dotX.value = centerX;
      }
    };
  }

  // Animate dot when active tab changes
  useEffect(() => {
    const activeTabLayout = tabLayouts.current[state.index];
    if (activeTabLayout) {
      // Slide down, move horizontally at bottom, then slide up
      dotY.value = withSequence(
        withTiming(20, { duration: 200, easing: Easing.in(Easing.cubic) }),
        withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) }),
      );

      // Move horizontally when dot reaches the bottom
      dotX.value = withDelay(
        200, // Wait for down animation to complete
        withTiming(activeTabLayout.centerX, { duration: 0 }), // Instant move at bottom
      );
    }
  }, [state.index, dotX, dotY]);

  // Animated style for the dot
  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dotX.value }, { translateY: dotY.value }],
    };
  });

  return (
    <MappedLinearGradient
      colors={[backgroundColor + '00', backgroundColor + 'DD', backgroundColor]}
      className="absolute right-0 bottom-0 left-0 items-center"
      style={{
        paddingBottom: bottom || spacingLg,
        height: TAB_BAR_HEIGHT,
      }}
      // onLayout={(e) => console.log(e.nativeEvent.layout.height)}
    >
      <BlurView
        intensity={20}
        className="gap-xs px-md py-sm bg-surface border-border relative shrink flex-row self-center overflow-hidden rounded-full border shadow-sm"
        style={{
          maxWidth: screenWidth - spacingLg * 2,
        }}
      >
        {/* Sliding dot indicator */}
        <Animated.View
          className="absolute bottom-0 -left-[2.5px] h-1 w-1 rounded-full"
          style={[{ backgroundColor: accentColor }, dotAnimatedStyle]}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              descriptors={descriptors}
              navigation={navigation}
              onLayout={handleTabLayout(index)}
              totalRoutes={state.routes.length}
            />
          );
        })}
      </BlurView>
    </MappedLinearGradient>
  );
};

const TabItem = ({
  route,
  isFocused,
  descriptors,
  navigation,
  onLayout,
  totalRoutes,
}: TabItemPropsWithLayout): JSX.Element => {
  const { options } = descriptors[route.key];
  const accentColor = useCSSVariable('--color-accent') as string;
  const textColorMuted = useCSSVariable('--color-muted') as string;

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

  // Use flex: 1 only when there are many items (5+), otherwise let items size naturally
  const shouldFlex = totalRoutes >= 5;

  return (
    <View
      className={twMerge('min-w-0 shrink', shouldFlex ? 'flex-1' : '')}
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
