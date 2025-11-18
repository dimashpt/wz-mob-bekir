import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Image as RNImage,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export interface ImagePreviewModal {
  open: (url: string) => void;
  close: () => void;
}

interface ImagePreviewModalProps {
  onClose?: () => void;
  rounded?: boolean;
  imageWidth?: number;
  ref?: React.Ref<ImagePreviewModal>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function ImagePreviewModal({
  onClose,
  rounded = false,
  imageWidth = screenWidth - 32, // Default: screen width minus padding
  ref,
}: ImagePreviewModalProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const spacingXs = useCSSVariable('--spacing-xs') as number;
  const radiusMd = useCSSVariable('--radius-md') as number;

  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Animation values
  const backdropOpacity = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const imageAppearScale = useSharedValue(0);
  const imageTranslateX = useSharedValue(0);
  const imageTranslateY = useSharedValue(0);
  const closeButtonOpacity = useSharedValue(0);
  const blurOpacity = useSharedValue(0);

  // Gesture state
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    open: (url: string) => {
      setIsVisible(true);
      setImageUrl(url);
      setImageError(false);
      setImageLoaded(false);
      setImageDimensions(null);

      // Reset animation values
      imageScale.value = 1;
      imageAppearScale.value = 0;
      imageTranslateX.value = 0;
      imageTranslateY.value = 0;
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;

      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 300 });
      closeButtonOpacity.value = withTiming(1, { duration: 300 });
      blurOpacity.value = withTiming(1, { duration: 300 });
    },
    close: () => {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      closeButtonOpacity.value = withTiming(0, { duration: 200 });
      blurOpacity.value = withTiming(0, { duration: 200 });

      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 200);
    },
  }));

  function handleImageError(): void {
    setImageError(true);
  }

  function handleImageLoad(event: {
    source: { width: number; height: number };
  }): void {
    const { width, height } = event.source;
    // Always update dimensions from onLoad as it's the most accurate source
    // This ensures we have the correct dimensions as soon as the image loads
    setImageDimensions({ width, height });
    setImageLoaded(true);
    // Animate image appearance with subtle scale
    imageAppearScale.value = withTiming(1, {
      duration: 250,
    });
  }

  function handleImageLoadEnd(): void {
    // onLoadEnd is called even when image is loaded from cache
    // Use this to ensure imageLoaded state is set even if onLoad was skipped
    if (!imageLoaded) {
      setImageLoaded(true);
      // Animate image appearance with subtle scale
      imageAppearScale.value = withTiming(1, {
        duration: 250,
      });
    }
  }

  // Get image dimensions when imageUrl changes
  // This is called immediately when URL changes, before the image component renders
  // This helps reduce layout shift by having dimensions ready early
  useEffect(() => {
    if (!imageUrl) {
      return;
    }

    let isCancelled = false;

    // Always try to get dimensions using Image.getSize first
    // This works even for cached images and provides dimensions immediately
    RNImage.getSize(
      imageUrl,
      (width: number, height: number) => {
        // Set dimensions immediately if not cancelled
        // onLoad will confirm/update these dimensions when image actually loads
        if (!isCancelled) {
          setImageDimensions({ width, height });
        }
      },
      () => {
        // If getSize fails (e.g., network error, invalid URI),
        // dimensions will be set from onLoad event when image loads
        // This is fine - onLoad is the fallback source
      },
    );

    // Cleanup function to prevent setting dimensions after URL changes or component unmounts
    return () => {
      isCancelled = true;
    };
  }, [imageUrl]);

  function closeModal(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  }

  const tapGesture = Gesture.Tap().onEnd(() => scheduleOnRN(closeModal));

  // Pinch gesture for zoom (temporary zoom while touching)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = Math.max(1, Math.min(4, savedScale.value * event.scale));
      imageScale.value = newScale;
    })
    .onEnd(() => {
      // Reset to normal scale when fingers are lifted
      imageScale.value = withSpring(1);
      imageTranslateX.value = withSpring(0);
      imageTranslateY.value = withSpring(0);
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Pan gesture for moving when zoomed (temporary pan while touching)
  const panGesture = Gesture.Pan()
    .maxPointers(2)
    .minPointers(2)
    .onUpdate((event) => {
      if (imageScale.value > 1) {
        const maxTranslateX = (screenWidth * (imageScale.value - 1)) / 2;
        const maxTranslateY = (screenHeight * (imageScale.value - 1)) / 2;

        imageTranslateX.value = Math.max(
          -maxTranslateX,
          Math.min(maxTranslateX, savedTranslateX.value + event.translationX),
        );
        imageTranslateY.value = Math.max(
          -maxTranslateY,
          Math.min(maxTranslateY, savedTranslateY.value + event.translationY),
        );
      }
    })
    .onEnd(() => {
      // Reset pan when fingers are lifted
      imageTranslateX.value = withSpring(0);
      imageTranslateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Omnidirectional drag with magnet-like resistance and close on vertical extremes
  const dragGesture = Gesture.Pan()
    .maxPointers(1)
    .onUpdate((event) => {
      if (imageScale.value <= 1) {
        // Apply magnet-like resistance - the further you drag, the more resistance
        const maxDistanceX = imageWidth * 0.6; // Maximum horizontal distance based on image width
        const maxDistanceY = screenHeight * 0.4; // Maximum vertical distance
        const resistance = 0.6; // Resistance factor (0-1, lower = more resistance)

        // Calculate dampened translation with resistance for both axes
        const dampenedTranslationX = event.translationX * resistance;
        const dampenedTranslationY = event.translationY * resistance;

        // Clamp translations to maximum distances
        const clampedTranslationX = Math.max(
          -maxDistanceX,
          Math.min(maxDistanceX, dampenedTranslationX),
        );
        const clampedTranslationY = Math.max(
          -maxDistanceY,
          Math.min(maxDistanceY, dampenedTranslationY),
        );

        imageTranslateX.value = clampedTranslationX;
        imageTranslateY.value = clampedTranslationY;
      }
    })
    .onEnd((event) => {
      if (imageScale.value <= 1) {
        // Close if swiped too far up or down
        if (Math.abs(event.translationY) > 200) {
          scheduleOnRN(closeModal);
        } else {
          // Return to center with spring animation
          backdropOpacity.value = withTiming(1);
          closeButtonOpacity.value = withTiming(1);
          blurOpacity.value = withTiming(1);
          imageTranslateX.value = withSpring(0);
          imageTranslateY.value = withSpring(0);
        }
      }
    });

  // Combine gestures - use Simultaneous for pinch+pan, then Race with drag
  const pinchWithPan = Gesture.Simultaneous(pinchGesture, panGesture);
  const composedGesture = Gesture.Race(pinchWithPan, dragGesture);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: imageScale.value * imageAppearScale.value },
      { translateX: imageTranslateX.value },
      { translateY: imageTranslateY.value },
    ],
  }));

  const closeButtonStyle = useAnimatedStyle(() => ({
    opacity: closeButtonOpacity.value,
  }));

  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  // Calculate image display dimensions
  const imageDisplayWidth = imageWidth;
  // Calculate height based on aspect ratio, with max constraint to prevent overflow
  // Wait for dimensions to be available to ensure accurate aspect ratio
  // This prevents layout shifts and incorrect sizing
  const imageDisplayHeight = imageDimensions
    ? Math.min(
        imageWidth * (imageDimensions.height / imageDimensions.width),
        screenHeight * 0.8, // Max 80% of screen height to prevent overflow
      )
    : imageWidth; // Use square as temporary placeholder - will update when dimensions are available

  if (!isVisible || !imageUrl) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <GestureHandlerRootView>
        <Animated.View className="flex-1">
          <Animated.View className="absolute inset-0" style={blurStyle}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 30 : 20}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
            />
          </Animated.View>
          <Animated.View
            className="flex-1 items-center justify-center"
            style={backdropStyle}
          >
            <GestureDetector gesture={tapGesture}>
              <View className="absolute inset-0" />
            </GestureDetector>

            {/* Close Button */}
            <Animated.View
              className="absolute right-4 z-10"
              style={[closeButtonStyle, { top: top + spacingXs }]}
            >
              <Clickable onPress={closeModal}>
                <View className="h-8 w-8 items-center justify-center rounded-full bg-black/30">
                  <Icon name="close" size={20} className="text-white" />
                </View>
              </Clickable>
            </Animated.View>

            {/* Image Container */}
            <GestureDetector gesture={composedGesture}>
              <Animated.View
                style={[
                  imageStyle,
                  { borderRadius: rounded ? imageWidth / 2 : radiusMd },
                ]}
              >
                <Image
                  key={imageUrl}
                  source={{ uri: imageUrl }}
                  style={{
                    width: rounded ? imageWidth : imageDisplayWidth,
                    height: rounded ? undefined : imageDisplayHeight,
                    borderRadius: rounded ? imageWidth / 2 : radiusMd,
                    aspectRatio: rounded ? 1 : undefined,
                  }}
                  contentFit={rounded ? 'cover' : 'contain'}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  onLoadEnd={handleImageLoadEnd}
                />
              </Animated.View>
            </GestureDetector>

            {/* Error State */}
            {imageError && (
              <View className="gap-sm px-lg py-md absolute bottom-[100px] flex-row items-center rounded-md bg-black/70">
                <Icon name="info" size={20} className="text-danger" />
                <Text variant="labelM" color="danger">
                  {t('attachment_viewer.image_load_error')}
                </Text>
              </View>
            )}

            {/* Loading State */}
            {!imageLoaded && !imageError && (
              <View className="px-lg py-md absolute bottom-[100px] rounded-md bg-black/70">
                <Text variant="bodyM" color="light">
                  {t('general.loading')}
                </Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
