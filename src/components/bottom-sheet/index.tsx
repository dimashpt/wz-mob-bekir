import { ComponentProps } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import GBottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetModal as GBottomSheetModal,
  BottomSheetView as GBottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Button, ButtonProps } from '@/components/button';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

const MappedBottomSheet = withUniwind(GBottomSheet);
const MappedBottomSheetView = withUniwind(GBottomSheetView);
const MappedBottomSheetModal = withUniwind(GBottomSheetModal);

interface BottomSheetProps extends ComponentProps<typeof MappedBottomSheet> {
  ref?: React.Ref<GBottomSheet>;
  contentContainerProps?: Omit<
    React.ComponentProps<typeof GBottomSheetView>,
    'children'
  >;
}

interface BottomSheetModalProps
  extends ComponentProps<typeof MappedBottomSheetModal> {
  ref?: React.Ref<GBottomSheetModal>;
  dismissable?: boolean;
}

interface BottomSheetConfirmProps
  extends Omit<BottomSheetModalProps, 'children'> {
  ref?: React.RefObject<GBottomSheetModal | null>;
  variant?: 'success' | 'error' | 'info';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  handleClose?: () => void;
  handleSubmit?: () => void;
  closeButtonProps?: Omit<ButtonProps, 'onPress'>;
  submitButtonProps?: Omit<ButtonProps, 'onPress'>;
  contentContainerStyle?: ViewStyle;
  contentContainerClassName?: string;
}

interface BottomSheetViewProps
  extends React.ComponentProps<typeof GBottomSheetView> {
  detached?: boolean;
}

interface BlurBackdropProps extends BottomSheetBackdropProps {
  dismissable?: boolean;
}

function BlurBackdrop({
  animatedIndex,
  style,
  dismissable = true,
}: BlurBackdropProps): React.JSX.Element {
  const { dismiss } = useBottomSheetModal();

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
    };
  });

  function handlePress(): void {
    if (!dismissable) return;

    dismiss();
  }

  return (
    <Animated.View style={[style, StyleSheet.absoluteFill, animatedStyle]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 30}
        style={StyleSheet.absoluteFill}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      />
      {dismissable && (
        <Pressable style={StyleSheet.absoluteFill} onPress={handlePress} />
      )}
    </Animated.View>
  );
}

export function BottomSheet(props: BottomSheetProps): React.JSX.Element {
  return (
    <MappedBottomSheet
      enableBlurKeyboardOnGesture
      keyboardBlurBehavior="restore"
      {...props}
      handleIndicatorClassName={twMerge(
        'bg-border',
        props.handleIndicatorClassName,
      )}
      backgroundClassName={twMerge(
        'bg-surface rounded-lg',
        props.backgroundClassName,
      )}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView {...props.contentContainerProps}>
          {props.children}
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </MappedBottomSheet>
  );
}

function BottomSheetView(props: BottomSheetViewProps): React.JSX.Element {
  const { bottom } = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;

  return (
    <MappedBottomSheetView
      {...props}
      className={twMerge('px-lg', props.className)}
      style={[
        { paddingBottom: props.detached ? spacingLg : bottom || spacingLg },
        props?.style,
      ]}
    >
      {props.children}
    </MappedBottomSheetView>
  );
}

export function BottomSheetModal({
  ref,
  children,
  backdropComponent,
  dismissable = true,
  ...props
}: BottomSheetModalProps): React.JSX.Element {
  const { bottom } = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;

  const BlurBackdropWrapper = (
    backdropProps: BottomSheetBackdropProps,
  ): React.JSX.Element => (
    <BlurBackdrop dismissable={dismissable} {...backdropProps} />
  );

  return (
    <MappedBottomSheetModal
      ref={ref}
      detached
      enablePanDownToClose={dismissable}
      bottomInset={bottom || spacingLg}
      backdropComponent={backdropComponent ?? BlurBackdropWrapper}
      enableBlurKeyboardOnGesture
      keyboardBlurBehavior="restore"
      {...props}
      className={twMerge('mx-lg', props.className)}
      handleIndicatorClassName={twMerge(
        'bg-border',
        props.handleIndicatorClassName,
      )}
      backgroundClassName={twMerge(
        'bg-surface rounded-lg',
        props.backgroundClassName,
      )}
    >
      {children}
    </MappedBottomSheetModal>
  );
}

function BottomSheetConfirm({
  variant = 'info',
  title,
  children,
  closeButtonProps,
  submitButtonProps,
  description,
  contentContainerClassName,
  contentContainerStyle,
  dismissable = true,
  showCloseButton = false,
  handleClose: handleCloseProp,
  handleSubmit: handleSubmitProp,
  ref,
}: BottomSheetConfirmProps): React.JSX.Element {
  const { t } = useTranslation();

  const isSuccess = variant === 'success';
  const isInfo = variant === 'info';
  const buttonColor = variant === 'error' ? 'danger' : 'primary';

  function handleSubmit(): void {
    if (handleSubmitProp) handleSubmitProp();
    if (dismissable) ref?.current?.close();
  }

  function handleClose(): void {
    Keyboard.dismiss();
    handleCloseProp?.();
    ref?.current?.close();
  }

  return (
    <BottomSheetModal
      ref={ref}
      dismissable={dismissable}
      onDismiss={dismissable ? handleClose : undefined}
    >
      <BottomSheet.View
        detached
        className={twMerge(
          'gap-lg pb-lg rounded-md',
          contentContainerClassName,
        )}
        style={contentContainerStyle}
      >
        <View className="gap-xs items-center">
          {variant ? (
            <View className="p-sm">
              {isSuccess ? (
                <Icon name="tickCircle" size={50} className="text-success" />
              ) : isInfo ? (
                <Icon name="info" size={50} className="text-accent" />
              ) : (
                <Icon name="closeCircle" size={50} className="text-danger" />
              )}
            </View>
          ) : null}
          {title ? (
            <Text variant="headingXS" className="text-center">
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text className="text-center">{description}</Text>
          ) : null}
        </View>
        {children}
        <View className="gap-xs flex-row justify-center">
          {(handleCloseProp || showCloseButton) && (
            <Button
              text={closeButtonProps?.text ?? t('general.close')}
              onPress={handleClose}
              variant="outlined"
              color={buttonColor}
              className="flex-1"
              {...closeButtonProps}
            />
          )}
          {handleSubmit && (
            <Button
              text={submitButtonProps?.text ?? t('general.submit')}
              onPress={handleSubmit}
              variant="filled"
              className="flex-1"
              color={buttonColor}
              {...submitButtonProps}
            />
          )}
        </View>
      </BottomSheet.View>
    </BottomSheetModal>
  );
}

// View compound component
BottomSheet.View = BottomSheetView;
BottomSheet.Modal = BottomSheetModal;
BottomSheet.Confirm = BottomSheetConfirm;

// Export types
export type BottomSheet = GBottomSheet;
export type BottomSheetModal = GBottomSheetModal;
