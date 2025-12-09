import React, { forwardRef, RefObject, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

const { width } = Dimensions.get('window');

interface CustomTextInputProps extends Omit<TextInputProps, 'className'> {
  mandatory?: boolean;
  description?: string;
  helpers?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  transparent?: boolean;
  bottomSheet?: boolean;
  label?: string;
  mode?: 'outlined' | 'flat';
  dense?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  disabled?: boolean;
  errors?: string | string[];
  loading?: boolean;
  secret?: boolean;
  labelSuffix?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

const inputFieldVariants = tv({
  base: 'flex-row items-center rounded-md border',
  variants: {
    variant: {
      filled: 'bg-field-background',
      transparent: 'bg-transparent',
    },
  },
});

/**
 * CustomTextInput component is a styled text input field with additional features such as
 * description, error messages, and helper texts. It uses react-native's TextInput
 * and provides a customizable input field with adornments.
 *
 * @component
 * @param {CustomTextInputProps} props - The props for the CustomTextInput component.
 * @param {boolean} [props.dense=true] - Determines if the input field should be dense.
 * @param {string} [props.description] - Description text displayed below the label.
 * @param {string[]} [props.errors] - Array of error messages to be displayed.
 * @param {string} [props.helpers] - Helper text to be displayed.
 * @param {string} [props.mode="outlined"] - The mode of the TextInput (e.g., "outlined").
 * @param {string} [props.label] - The label text for the input field.
 * @param {React.ReactNode} [props.left] - Content to be displayed on the left side of the input field.
 * @param {React.ReactNode} [props.right] - Content to be displayed on the right side of the input field.
 * @param {boolean} [props.bottomSheet=false] - When true, uses BottomSheetTextInput for bottom sheet compatibility.
 * @param {React.RefObject<TextInput>} ref - The ref object for the native text input.
 * @returns {JSX.Element} The rendered CustomTextInput component.
 */
export const InputField = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      mandatory = false,
      description,
      errors,
      helpers,
      label,
      left,
      right,
      onPressLeft,
      onPressRight,
      transparent,
      bottomSheet = false,
      loading = false,
      secret = false,
      labelSuffix,
      className,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);
    const isFilled = props.value !== undefined && props.value !== '';

    const placeholderTextColor = useCSSVariable(
      '--color-field-placeholder',
    ) as string;

    function handleFocus(): void {
      return setIsFocused(true);
    }

    function handleBlur(): void {
      return setIsFocused(false);
    }

    function getBorderClassName(): string {
      if (errors) return 'border-danger';

      if (isFocused) return 'border-accent';

      if (isFilled) return 'border-muted';

      return 'border-field-border';
    }

    function toggleSecureTextVisibility(): void {
      setIsSecureTextVisible(!isSecureTextVisible);
    }

    return (
      <View className="gap-xs">
        {label || description ? (
          <View className="gap-xs">
            {label ? (
              <View className="gap-sm flex-row items-center justify-between">
                <Text variant="labelS" className="font-medium">
                  {label}
                  {mandatory ? (
                    <Text
                      variant="labelM"
                      color="danger"
                      className="font-medium"
                    >
                      *
                    </Text>
                  ) : null}
                </Text>
                {labelSuffix}
              </View>
            ) : null}
            {description ? (
              <Text variant="bodyS" color="muted">
                {description}
              </Text>
            ) : null}
          </View>
        ) : null}
        <View className="gap-xs">
          <View
            className={twMerge(
              inputFieldVariants({
                variant: transparent ? 'transparent' : 'filled',
              }),
              getBorderClassName(),
              props.disabled && 'bg-field-disabled',
              className,
            )}
          >
            {left && (
              <Clickable
                disabled={!onPressLeft}
                onPress={onPressLeft}
                className="pr-xs pl-md py-sm items-center justify-center rounded-md"
              >
                {left}
              </Clickable>
            )}
            {bottomSheet ? (
              <BottomSheetTextInput
                editable={!props.disabled}
                {...props}
                // @ts-ignore
                ref={ref as RefObject<TextInput>}
                secureTextEntry={secret && !isSecureTextVisible}
                className={twMerge(
                  'p-md flex-1 rounded-md',
                  'android:font-map-normal font-sans text-sm/tight',
                  left ? 'pl-xs' : '',
                  right ? 'pr-xs' : '',
                  props.disabled || transparent
                    ? 'text-muted-foreground'
                    : 'text-field-foreground',
                  inputClassName,
                )}
                onFocus={(e) => {
                  handleFocus();
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  handleBlur();
                  props.onBlur?.(e);
                }}
              />
            ) : (
              <TextInput
                editable={!props.disabled}
                {...props}
                secureTextEntry={secret && !isSecureTextVisible}
                className={twMerge(
                  'p-md flex-1 rounded-md',
                  'android:font-map-normal font-sans text-sm/tight',
                  left ? 'pl-xs' : '',
                  right ? 'pr-xs' : '',
                  props.disabled || transparent
                    ? 'text-muted-foreground'
                    : 'text-field-foreground',
                  inputClassName,
                )}
                placeholderTextColor={placeholderTextColor}
                onFocus={(e) => {
                  handleFocus();
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  handleBlur();
                  props.onBlur?.(e);
                }}
                ref={ref}
              />
            )}
            {(right || loading || secret) && (
              <Clickable
                disabled={secret ? false : !onPressRight}
                onPress={secret ? toggleSecureTextVisibility : onPressRight}
                className="pr-md pl-xs py-md items-center justify-center rounded-md"
              >
                {loading ? (
                  <ActivityIndicator size={8} />
                ) : secret ? (
                  <Icon
                    name={isSecureTextVisible ? 'eye' : 'eyeSlash'}
                    size="lg"
                    className={
                      errors ? 'text-danger' : 'text-field-placeholder'
                    }
                  />
                ) : (
                  right
                )}
              </Clickable>
            )}
          </View>
          {helpers ? (
            <View style={{ maxWidth: width * 0.85 }}>
              <View className="gap-xs flex-row items-center">
                <Text variant="bodyXS" color="muted">
                  {helpers}
                </Text>
              </View>
            </View>
          ) : null}
          {errors?.length ? (
            <View>
              {(Array.isArray(errors) ? errors : [errors]).map((error) =>
                error ? (
                  <Text variant="bodyXS" color="danger" key={`error-${error}`}>
                    {error}
                  </Text>
                ) : null,
              )}
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);
