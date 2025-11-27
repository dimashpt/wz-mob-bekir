import React, { ComponentProps, ReactNode } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView as KeyboardAwareScrollViewRNK } from 'react-native-keyboard-controller';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { withUniwind } from 'uniwind';

const KeyboardAwareScrollView = withUniwind(KeyboardAwareScrollViewRNK);

const containerVariants = tv({
  base: 'flex-1 bg-background',
  variants: {
    variant: {
      default: 'bg-background',
      transparent: 'bg-transparent',
      surface: 'bg-surface',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const scrollContainerVariants = tv({
  base: 'grow',
});

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'transparent' | 'surface';
  style?: StyleProp<ViewStyle>;
}

interface KeyboardAwareScrollViewProps
  extends ComponentProps<typeof KeyboardAwareScrollView> {
  children: ReactNode;
  contentContainerClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ref?: React.Ref<ScrollView>;
}

const ContainerComponent = ({
  className,
  variant = 'default',
  style,
  ...props
}: ContainerProps): React.ReactElement => {
  return (
    <View
      {...props}
      className={twMerge(containerVariants({ variant }), className)}
      style={style}
    />
  );
};

function ContainerScroll({
  children,
  contentContainerClassName,
  contentContainerStyle,
  ref,
  ...props
}: KeyboardAwareScrollViewProps): React.ReactElement {
  return (
    <KeyboardAwareScrollView
      ref={ref}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={twMerge(
        scrollContainerVariants(),
        contentContainerClassName,
      )}
      contentContainerStyle={contentContainerStyle}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

function ContainerCard({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <View className={twMerge('bg-surface p-md gap-md rounded-md', className)}>
      {children}
    </View>
  );
}

// Compound component
export const Container = Object.assign(ContainerComponent, {
  Scroll: ContainerScroll,
  Card: ContainerCard,
});
