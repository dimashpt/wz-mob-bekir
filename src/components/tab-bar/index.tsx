import React, { JSX, useEffect } from 'react';
import { LayoutChangeEvent, useWindowDimensions } from 'react-native';

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
import { useCSSVariable, withUniwind } from 'uniwind';

import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { TabItem } from './tab-item';

const MappedLinearGradient = withUniwind(LinearGradient);

interface TabBarProps extends BottomTabBarProps {
  hiddenRoutes?: string[];
}

export const TabBar = ({
  state,
  descriptors,
  navigation,
  hiddenRoutes = [],
}: TabBarProps): JSX.Element => {
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const backgroundColor = useCSSVariable('--color-background') as string;
  const accentColor = useCSSVariable('--color-accent') as string;

  // Store layout measurements for each tab using filtered indices
  const tabLayouts = React.useRef<
    Record<number, { x: number; centerX: number }>
  >({});

  // Shared values for dot indicator position
  const dotX = useSharedValue(0);
  const dotY = useSharedValue(0);

  function handleTabLayout(filteredIndex: number) {
    return (event: LayoutChangeEvent): void => {
      const { x, width } = event.nativeEvent.layout;
      const centerX = x + width / 2;
      tabLayouts.current[filteredIndex] = { x, centerX };

      // Initialize dot position on first layout
      const stateIndex = filteredIndexToStateIndex[filteredIndex];
      if (stateIndex === state.index) {
        dotX.value = centerX;
      }
    };
  }

  // TODO: implement response-based feature flag
  const tabItems = state.routes.filter(
    (route) => !hiddenRoutes.includes(route.name),
  );

  // Create a mapping of filtered indices to original state indices
  const filteredIndexToStateIndex = React.useMemo(() => {
    const mapping: Record<number, number> = {};
    let filteredIndex = 0;
    for (let i = 0; i < state.routes.length; i++) {
      if (!hiddenRoutes.includes(state.routes[i].name)) {
        mapping[filteredIndex] = i;
        filteredIndex++;
      }
    }
    return mapping;
  }, [state.routes, hiddenRoutes]);

  // Animate dot when active tab changes
  useEffect(() => {
    // Find the filtered index of the active tab
    const activeFilteredIndex = Object.entries(filteredIndexToStateIndex).find(
      ([, stateIndex]) => stateIndex === state.index,
    )?.[0];

    if (activeFilteredIndex !== undefined) {
      const activeTabLayout = tabLayouts.current[parseInt(activeFilteredIndex)];
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
    }
  }, [state.index, dotX, dotY, filteredIndexToStateIndex]);

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
        className="gap-md px-xl py-sm bg-surface border-border relative shrink flex-row self-center overflow-hidden rounded-full border shadow-sm"
        style={{
          maxWidth: screenWidth - spacingLg * 2,
        }}
      >
        {/* Sliding dot indicator */}
        <Animated.View
          className="absolute bottom-0 -left-[2.5px] h-1 w-1 rounded-full"
          style={[{ backgroundColor: accentColor }, dotAnimatedStyle]}
        />
        {tabItems.map((route, filteredIndex) => {
          const stateIndex = filteredIndexToStateIndex[filteredIndex];
          const isFocused = state.index === stateIndex;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              descriptors={descriptors}
              navigation={navigation}
              onLayout={handleTabLayout(filteredIndex)}
              totalRoutes={tabItems.length}
            />
          );
        })}
      </BlurView>
    </MappedLinearGradient>
  );
};
