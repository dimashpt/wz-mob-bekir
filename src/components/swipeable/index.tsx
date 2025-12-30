/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { forwardRef, useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { useHaptic } from '@/hooks';

const WIDTH = Dimensions.get('screen').width;

const SNAP_POINT = 96;
const DRAG_TOSS = 0.05;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const rowCloseSpringConfig = { duration: 250, dampingRatio: 1 };
const overSwipedSpringConfig = { duration: 250, dampingRatio: 1 };

export type SwipeableProps = {
  /**
   * The content inside the Swipeable component.
   */
  children: React.ReactNode;
  /**
   * The index of the swipeable component.
   */
  index: number;
  /**
   * Callback function invoked when the left element is pressed.
   */
  handleLeftElementPress?: () => void;
  /**
   * Callback function invoked when the right element is pressed.
   */
  handleRightElementPress?: () => void;
  /**
   * Callback function invoked overswiped in left direction.
   */
  handleOnLeftOverswiped?: () => void;
  /**
   * Callback function invoked overswiped in right direction.
   */
  handleOnRightOverswiped?: () => void;
  /**
   * The content of the left swipeable element.
   */
  leftElement?: React.ReactNode;
  /**
   * The content of the right swipeable element.
   */
  rightElement?: React.ReactNode;
  /**
   * Callback function invoked when a simple press is detected on the swipeable component.
   */
  handlePress: () => void;
  /**
   * Callback function invoked when a long press is detected on the swipeable component.
   */
  handleLongPress?: () => void;
  /**
   * Spacing in the left and right
   */
  spacing: number;
  /**
   * A boolean to test if you want to trigger the overswipe callbacks when flicked
   * @defaults to false
   */
  triggerOverswipeOnFlick?: boolean;
  /**
   * Whether swipe gestures are enabled
   * @defaults to true
   */
  isSwipeEnabled?: boolean;
  /**
   * No of pointers
   */
  noOfPointers?: number;
};

export const Swipeable = forwardRef(
  ({ spacing = 20, ...props }: SwipeableProps, _ref) => {
    const {
      children,
      index,
      handleLeftElementPress,
      handleOnLeftOverswiped,
      handleRightElementPress,
      handleOnRightOverswiped,
      leftElement,
      rightElement,
      handlePress,
      handleLongPress,
      triggerOverswipeOnFlick = false,
      isSwipeEnabled = true,
      noOfPointers = 1,
    } = props;

    const hapticWarning = useHaptic('success');
    const hapticSelection = useHaptic();

    const animStatePos = useSharedValue(0);
    const isGestureActive = useSharedValue(false);

    const maxTranslation = WIDTH * 0.6;
    const maxSnapPointLeft = -maxTranslation;
    const maxSnapPointRight = maxTranslation;

    const swipingLeft = useDerivedValue(
      () => animStatePos.value < 0,
      [animStatePos],
    );
    const swipingRight = useDerivedValue(
      () => animStatePos.value > 0,
      [animStatePos],
    );

    const percentOpenLeft = useDerivedValue(() => {
      return swipingLeft.value && maxSnapPointLeft
        ? Math.abs(animStatePos.value / maxSnapPointLeft)
        : 0;
    }, [maxSnapPointLeft]);

    const percentOpenRight = useDerivedValue(() => {
      return swipingRight.value && maxSnapPointRight
        ? Math.abs(animStatePos.value / maxSnapPointRight)
        : 0;
    }, [maxSnapPointRight]);

    const startX = useSharedValue(0);
    const dragOverSwiped = useSharedValue(false);

    const overSwipedState = useSharedValue(0);

    const isTapped = useSharedValue(0);

    const hasLeftElement = useDerivedValue(() => leftElement !== undefined);
    const hasRightElement = useDerivedValue(() => rightElement !== undefined);

    function closeRow(): void {
      'worklet';
      animStatePos.value = withSpring(0, rowCloseSpringConfig);
      startX.value = 0;
    }

    const commonOnPressEffect = useCallback(() => {
      closeRow();
      hapticSelection && hapticSelection();
    }, []);

    useAnimatedReaction(
      () => dragOverSwiped.value,
      (currentValue, previousValue) => {
        // Drag has been overswiped and beyond max translation
        if (currentValue !== previousValue && currentValue) {
          hapticWarning && runOnJS(hapticWarning)();
        }
      },
    );

    const tapGesture = Gesture.Tap()
      .onBegin(
        () =>
          (isTapped.value = withSpring(1, { duration: 250, dampingRatio: 1 })),
      )
      .onEnd(() => runOnJS(handlePress)())
      .onFinalize(
        () =>
          (isTapped.value = withSpring(0, { duration: 250, dampingRatio: 1 })),
      );

    const panGesture = Gesture.Pan()
      .enabled(isSwipeEnabled)
      .maxPointers(noOfPointers)
      .activeOffsetX([-20, 20])
      .onBegin(() => {
        dragOverSwiped.value = false;
      })
      .onStart(() => {
        isTapped.value = withSpring(0, { duration: 250, dampingRatio: 1 });
        startX.value = animStatePos.value;
        isGestureActive.value = true;
      })
      .onUpdate((evt) => {
        const translationX =
          (evt.translationX + DRAG_TOSS * evt.velocityX) / 1!;
        const rawVal = translationX + startX.value;
        const clampedVal = interpolate(
          rawVal,
          [
            -maxTranslation - 1,
            -maxTranslation,
            maxTranslation,
            maxTranslation + 1,
          ],
          [
            -maxTranslation - 0.3,
            -maxTranslation,
            maxTranslation,
            maxTranslation + 0.3,
          ],
        );

        if (
          Math.abs(clampedVal) > maxTranslation &&
          Math.abs(evt.velocityX) < 500
        ) {
          // We might have to trigger the overswipe action when it is swiped in higher speed
          // Setting a variable to know that its going to an over swiped case
          dragOverSwiped.value = true;
          overSwipedState.value = withSpring(1, overSwipedSpringConfig);
        } else {
          if (dragOverSwiped.value) {
            overSwipedState.value = withSpring(
              0,
              overSwipedSpringConfig,
              (finished) => {
                if (finished) {
                  dragOverSwiped.value = false;
                }
              },
            );
          }
        }

        // Clamped Value > 0 - for Left Element
        // Clamped Value < 0 - for Right Element
        if (clampedVal > 0 && hasLeftElement.value) {
          animStatePos.value = withSpring(clampedVal, {
            duration: 250,
            dampingRatio: 1,
          });
        }

        if (clampedVal < 0 && hasRightElement.value) {
          animStatePos.value = withSpring(clampedVal, {
            duration: 250,
            dampingRatio: 1,
          });
        }
      })
      .onEnd((evt) => {
        /**
         * The below two conditions takes care of triggering the over swipe
         * when `triggerOverswipeOnFlick` is set to true
         */
        if (
          hasLeftElement.value &&
          evt.translationX > maxSnapPointRight &&
          triggerOverswipeOnFlick
        ) {
          // The case where you are swiping towards right and the left element is present
          handleOnLeftOverswiped && runOnJS(handleOnLeftOverswiped)();
          if (!dragOverSwiped.value) {
            // trigger haptic in cases where the drag isnt overswiped but is flicked to trigger action
            hapticWarning && runOnJS(hapticWarning)();
          }
          animStatePos.value = withSpring(
            0,
            { ...rowCloseSpringConfig, velocity: evt.velocityX / 15 },
            (finished) => {
              if (finished) {
                isGestureActive.value = false;
                overSwipedState.value = 0;
                dragOverSwiped.value = false;
              }
            },
          );
          return;
        }
        if (
          hasRightElement.value &&
          evt.translationX < maxSnapPointLeft &&
          triggerOverswipeOnFlick
        ) {
          // The case where you are swiping towards left and the right element is present
          handleOnRightOverswiped && runOnJS(handleOnRightOverswiped)();
          if (!dragOverSwiped.value) {
            // trigger haptic in cases where the drag isnt overswiped but is flicked to trigger action
            hapticWarning && runOnJS(hapticWarning)();
          }
          animStatePos.value = withSpring(
            0,
            { ...rowCloseSpringConfig, velocity: evt.velocityX / 15 },
            (finished) => {
              if (finished) {
                isGestureActive.value = false;
                overSwipedState.value = 0;
                dragOverSwiped.value = false;
              }
            },
          );
          return;
        }
        if (dragOverSwiped.value) {
          // Pane is overswiped and the direction is towards right and it has left element
          if (hasLeftElement.value && swipingRight.value) {
            handleOnLeftOverswiped && runOnJS(handleOnLeftOverswiped)();
          }
          // Pane is overswiped and the direction is towards left and it has right element
          if (hasRightElement.value && swipingLeft.value) {
            handleOnRightOverswiped && runOnJS(handleOnRightOverswiped)();
          }
          animStatePos.value = withSpring(
            0,
            { ...rowCloseSpringConfig, velocity: evt.velocityX / 15 },
            (finished) => {
              if (finished) {
                isGestureActive.value = false;
                overSwipedState.value = 0;
                dragOverSwiped.value = false;
              }
            },
          );
        } else {
          const isLeftOpen = swipingLeft.value;
          const isRightOpen = swipingRight.value;

          /**
           * A case where we need to snap to the closest snap point
           */
          const velocityModifiedPosition =
            animStatePos.value + evt.velocityX / 8;
          // Conditional Snap points so that we dont open the
          const allSnapPoints = [
            0,
            !hasLeftElement.value ? 0 : isLeftOpen ? 0 : SNAP_POINT,
            !hasRightElement.value ? 0 : isRightOpen ? 0 : -SNAP_POINT,
          ];

          const closestSnapPoint = allSnapPoints.reduce((acc, cur) => {
            const diff = Math.abs(velocityModifiedPosition - cur);
            const prevDiff = Math.abs(velocityModifiedPosition - acc);
            return diff < prevDiff ? cur : acc;
          }, Infinity);

          animStatePos.value = withSpring(
            closestSnapPoint,
            { damping: 50, stiffness: 360, mass: 1 },
            (finished) => {
              if (finished) {
                isGestureActive.value = false;
              }
            },
          );
        }
      });

    const overlayStyle = useAnimatedStyle(() => {
      const transform = [{ translateX: animStatePos.value }];

      return { transform };
    }, [animStatePos]);

    const leftStyle = useAnimatedStyle(() => {
      const opacity = percentOpenRight.value > 0 ? 1 : 0;
      const zIndex = percentOpenRight.value > 0 ? 10 : 0;

      return { opacity, zIndex };
    });

    const rightStyle = useAnimatedStyle(() => {
      const opacity = percentOpenLeft.value > 0 ? 1 : 0;
      const zIndex = percentOpenLeft.value > 0 ? 10 : 0;

      return { opacity, zIndex };
    });

    const leftTranslation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: dragOverSwiped.value
              ? interpolate(
                  overSwipedState.value,
                  [0, 1],
                  [0, animStatePos.value - SNAP_POINT],
                )
              : interpolate(
                  animStatePos.value,
                  [0, SNAP_POINT],
                  [-SNAP_POINT, 0],
                  Extrapolation.CLAMP,
                ),
          },
        ],
      };
    });

    const rightTranslation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: dragOverSwiped.value
              ? interpolate(
                  overSwipedState.value,
                  [0, 1],
                  [0, animStatePos.value + SNAP_POINT],
                )
              : interpolate(
                  animStatePos.value,
                  [0, -SNAP_POINT],
                  [SNAP_POINT, 0],
                  Extrapolation.CLAMP,
                ),
          },
        ],
      };
    });

    function handleOnPressLeft(): void {
      commonOnPressEffect();
      handleLeftElementPress?.();
    }

    function handleOnPressRight(): void {
      commonOnPressEffect();
      handleRightElementPress?.();
    }

    const flingGesture = Gesture.Fling();

    const longPressGesture = Gesture.LongPress()
      .enabled(Boolean(handleLongPress))
      .minDuration(750)
      .maxDistance(20)
      .onStart(() => {
        if (handleLongPress) {
          runOnJS(handleLongPress)();
        }
      });

    const cellGestures = Gesture.Race(
      panGesture,
      tapGesture,
      flingGesture,
      longPressGesture,
    );

    return (
      <Animated.View className="flex flex-row">
        <AnimatedPressable
          onPress={handleOnPressLeft}
          className={twMerge(
            'absolute flex items-start justify-center rounded-md',
            hasLeftElement ? 'bg-accent' : '',
          )}
          style={[StyleSheet.absoluteFillObject, leftStyle]}
        >
          <Animated.View style={[{ paddingLeft: spacing }, leftTranslation]}>
            {leftElement}
          </Animated.View>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={handleOnPressRight}
          className={twMerge(
            'flex items-end justify-center rounded-md',
            hasRightElement ? 'bg-danger' : '',
          )}
          style={[StyleSheet.absoluteFillObject, rightStyle]}
        >
          <Animated.View style={[{ paddingRight: spacing }, rightTranslation]}>
            {rightElement}
          </Animated.View>
        </AnimatedPressable>
        <GestureDetector gesture={cellGestures}>
          <Animated.View className="z-10 w-screen flex-1" style={overlayStyle}>
            {children}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  },
);
