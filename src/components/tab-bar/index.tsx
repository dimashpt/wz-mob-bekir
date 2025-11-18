import React, { JSX, useEffect } from 'react';
import { LayoutChangeEvent, useWindowDimensions, View } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Text } from '@/components/text';
import { TAB_BAR_HEIGHT } from '@/constants/ui';

const MappedLinearGradient = withUniwind(LinearGradient);

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][0];
  isFocused: boolean;
  descriptors: BottomTabBarProps['descriptors'];
  navigation: BottomTabBarProps['navigation'];
}

interface TabItemPropsWithLayout extends TabItemProps {
  onLayout: (event: LayoutChangeEvent) => void;
}

const TabItem = ({
  route,
  isFocused,
  descriptors,
  navigation,
  onLayout,
}: TabItemPropsWithLayout): JSX.Element => {
  const { options } = descriptors[route.key];
  const accentColor = useCSSVariable('--color-accent') as string;
  const textColorMuted = useCSSVariable('--color-muted') as string;
  const spacingSm = useCSSVariable('--spacing-sm') as number;

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel.toString()
      : options.title !== undefined
        ? options.title.toString()
        : route.name;

  // Animated style for gap between icon and label
  const gapAnimatedStyle = useAnimatedStyle(() => {
    return {
      gap: spacingSm,
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

  function renderIcon(): React.ReactNode {
    if (options.tabBarIcon) {
      return options.tabBarIcon!({
        focused: isFocused,
        color: isFocused ? accentColor : textColorMuted,
        size: 20,
      });
    }
    return null;
  }

  return (
    <Clickable
      key={route.key}
      onPress={onPress}
      onLayout={onLayout}
      className="py-xs px-sm gap-y-xs relative flex-col items-center justify-center rounded-full"
      style={gapAnimatedStyle}
    >
      {renderIcon()}
      <Text
        variant="labelXS"
        color={isFocused ? 'accent' : 'muted'}
        className="text-xs"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Clickable>
  );
};

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

  // Shared value for dot indicator position
  const dotX = useSharedValue(0);

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
      dotX.value = withTiming(activeTabLayout.centerX, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [state.index, dotX]);

  // Animated style for the dot
  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dotX.value }],
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
      <View
        className="px-md py-sm bg-surface border-border gap-xs relative flex-row rounded-full border shadow-md"
        style={{ maxWidth: screenWidth - spacingLg * 2 }}
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
            />
          );
        })}
      </View>
    </MappedLinearGradient>
  );
};
