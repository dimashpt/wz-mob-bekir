import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

import { useAppStore } from '@/store/app-store';
import { Button } from '../button';
import { Clickable } from '../clickable';
import { Container } from '../container';
import { Icon } from '../icon';
import { Text } from '../text';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'The best way to learn math and computer science',
    subtitle:
      'Effective, hands-on learning, while learning at your level with guided bite-sized lessons.',
    icon: 'rocket-outline',
    iconColor: '#4CAF50',
    backgroundColor: '#F8F9FA',
  },
  {
    id: 2,
    title: 'Interactive problem solving',
    subtitle:
      'Learn by doing with interactive exercises that adapt to your learning pace and style.',
    icon: 'bulb-outline',
    iconColor: '#FF9800',
    backgroundColor: '#FFF8E1',
  },
  {
    id: 3,
    title: 'Track your progress',
    subtitle:
      'Monitor your learning journey with detailed analytics and achievement tracking.',
    icon: 'stats-chart-outline',
    iconColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
];

interface IndicatorDotProps {
  index: number;
  progress: SharedValue<number>;
  bgMuted: string;
  bgAccent: string;
  onPress: () => void;
}

function IndicatorDot({
  index,
  progress,
  bgMuted,
  bgAccent,
  onPress,
}: IndicatorDotProps): React.JSX.Element {
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate how close the scroll position is to this indicator's index
    const distance = Math.abs(progress.value - index);

    // Interpolate width: 24 when active (distance = 0), 8 when inactive (distance >= 1)
    const width = interpolate(distance, [0, 1], [24, 8], 'clamp');

    // Interpolate color: accent when active, muted when inactive
    const backgroundColor = interpolateColor(
      distance,
      [0, 1],
      [bgAccent, bgMuted],
    );

    return {
      width,
      backgroundColor,
    };
  });

  return (
    <Clickable onPress={onPress}>
      <Animated.View className="h-2 rounded" style={animatedStyle} />
    </Clickable>
  );
}

interface AnimatedButtonIconProps {
  scrollX: SharedValue<number>;
  totalSlides: number;
}

function AnimatedButtonIcon({
  scrollX,
  totalSlides,
}: AnimatedButtonIconProps): React.JSX.Element {
  const continueIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [totalSlides - 2, totalSlides - 1],
      [1, 0],
      'clamp',
    );

    return { opacity };
  });

  const finishIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [totalSlides - 2, totalSlides - 1],
      [0, 1],
      'clamp',
    );

    return { opacity };
  });

  return (
    <View className="size-2xl relative">
      <Animated.View
        className="absolute inset-0 items-center justify-center"
        style={continueIconStyle}
      >
        <Icon
          name="arrow"
          size="3xl"
          className="text-foreground-inverted"
          transform={[{ rotate: '270deg' }]}
        />
      </Animated.View>
      <Animated.View
        className="absolute inset-0 items-center justify-center"
        style={finishIconStyle}
      >
        <Icon name="tick" size="3xl" className="text-foreground-inverted" />
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen(): React.JSX.Element {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const bgMuted = useCSSVariable('--color-muted') as string;
  const bgAccent = useCSSVariable('--color-accent') as string;
  const { setHasCompletedOnboarding } = useAppStore();
  const isLastSlide = currentSlide === slides.length - 1;

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
    const offsetX = event.nativeEvent.contentOffset.x;
    const slideSize = event.nativeEvent.layoutMeasurement.width;

    // Update shared value with continuous scroll progress
    scrollX.value = offsetX / slideSize;

    // Update current slide index for button state
    const index = Math.round(offsetX / slideSize);
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  }

  function goToSlide(index: number): void {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    // Delay state update to sync with scroll animation
    setTimeout(() => {
      setCurrentSlide(index);
    }, 300);
  }

  function handleNext(): void {
    goToSlide(currentSlide + 1);
  }

  function handleFinish(): void {
    setHasCompletedOnboarding(true);
    router.replace('/login');
  }

  function handleSkip(): void {
    goToSlide(slides.length - 1);
  }

  return (
    <Container
      className="flex-1"
      style={{
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <Button
        text="Skip"
        onPress={handleSkip}
        variant="ghost"
        color="secondary"
        className={twMerge(
          'px-lg pt-sm flex-row justify-end',
          isLastSlide && 'hidden',
        )}
        disabled={isLastSlide}
      />

      {/* Swipable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            className="flex-1 justify-center"
            style={{ width }}
          >
            <View className="px-2xl gap-2xl flex-1 justify-center">
              {/* Icon */}
              <View
                className="h-[120px] w-[120px] items-center justify-center self-center rounded-full"
                style={{ backgroundColor: slide.iconColor + '20' }}
              >
                <Ionicons name={slide.icon} size={60} color={slide.iconColor} />
              </View>

              {/* Text Content */}
              <View className="items-center">
                <Text variant="headingM" className="mb-5 text-center">
                  {slide.title}
                </Text>
                <Text variant="bodyL" color="muted" className="text-center">
                  {slide.subtitle}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View className="gap-2xl flex-row justify-between px-5 pb-10">
        {/* Page Indicators */}
        <View className="pl-xl flex-1 flex-row gap-2 py-5">
          {slides.map((_, index) => (
            <IndicatorDot
              key={index}
              index={index}
              progress={scrollX}
              bgMuted={bgMuted}
              bgAccent={bgAccent}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
        <Button
          size="large"
          className="rounded-full"
          onPress={isLastSlide ? handleFinish : handleNext}
          icon={
            <AnimatedButtonIcon scrollX={scrollX} totalSlides={slides.length} />
          }
        />
      </View>
    </Container>
  );
}
