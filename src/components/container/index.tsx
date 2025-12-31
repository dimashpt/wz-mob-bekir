import React, { ComponentProps, ReactNode } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import {
  KeyboardAwareScrollViewRef,
  KeyboardAwareScrollView as KeyboardAwareScrollViewRNK,
} from 'react-native-keyboard-controller';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { withUniwind } from 'uniwind';

import { AnimatedComponent } from '../animated-component';

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

interface KeyboardAwareScrollViewProps extends ComponentProps<
  typeof KeyboardAwareScrollView
> {
  children: ReactNode;
  contentContainerClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ref?: React.Ref<KeyboardAwareScrollViewRef>;
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

type ContainerCardProps = ComponentProps<typeof AnimatedComponent> & {
  children?: React.ReactNode;
  className?: string;
};

function ContainerCard({
  children,
  className,
  index,
  ...props
}: ContainerCardProps): React.ReactElement {
  return (
    <AnimatedComponent
      {...props}
      index={index}
      className={twMerge('bg-surface p-md gap-md rounded-md', className)}
    >
      {children}
    </AnimatedComponent>
  );
}

// Compound component
export const Container = Object.assign(ContainerComponent, {
  Scroll: ContainerScroll,
  Card: ContainerCard,
});
