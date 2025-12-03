import React, { forwardRef, RefObject, useState } from 'react';
import { Dimensions, TextInput, TextInputProps, View } from 'react-native';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Loader } from '@/components/loader';
import { Text } from '@/components/text';

const { width } = Dimensions.get('window');

interface CustomTextInputProps extends Omit<TextInputProps, 'className'> {
  mandatory?: boolean;
  description?: string;
  errors?: (string | undefined)[];
  helpers?: (string | undefined)[];
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
  error?: boolean;
  loading?: boolean;
  secret?: boolean;
  labelSuffix?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

const inputFieldVariants = tv({
  base: 'p-md flex-row items-center rounded-md border',
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
 * @param {string[]} [props.helpers] - Array of helper texts to be displayed.
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
      if (props.error) return 'border-danger';

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
                className="pr-xs items-center justify-center"
              >
                {left}
              </Clickable>
            )}
            {bottomSheet ? (
              <BottomSheetTextInput
                {...props}
                // @ts-ignore
                ref={ref as RefObject<TextInput>}
                editable={!props.disabled}
                secureTextEntry={secret && !isSecureTextVisible}
                className={twMerge(
                  'flex-1 py-0',
                  'android:font-map-normal font-sans text-base/tight',
                  props.multiline ? 'py-sm' : '',
                  props.disabled || transparent
                    ? 'text-foreground-muted'
                    : 'text-foreground',
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
                {...props}
                editable={!props.disabled}
                secureTextEntry={secret && !isSecureTextVisible}
                className={twMerge(
                  'flex-1 py-0',
                  'android:font-map-normal font-sans text-sm/tight',
                  props.multiline ? 'py-sm' : '',
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
                className="px-xs items-center justify-center"
              >
                {loading ? (
                  <Loader />
                ) : secret ? (
                  <Icon
                    name={isSecureTextVisible ? 'eyeSlash' : 'eye'}
                    size="lg"
                    className="text-field-placeholder"
                  />
                ) : (
                  right
                )}
              </Clickable>
            )}
          </View>
          {helpers?.length ? (
            <View style={{ maxWidth: width * 0.85 }}>
              {helpers.map((helper) =>
                helper ? (
                  <View
                    key={`helper-${helper}`}
                    className="gap-xs flex-row items-center"
                  >
                    <Text variant="bodyS" color="muted">
                      {helper}
                    </Text>
                  </View>
                ) : null,
              )}
            </View>
          ) : null}
          {errors?.length ? (
            <View style={{ maxWidth: width * 0.85 }}>
              {errors.map((error) =>
                error ? (
                  <View
                    key={`error-${error}`}
                    className="gap-xs flex-row items-center"
                  >
                    <Text variant="bodyS" color="danger">
                      {error}
                    </Text>
                  </View>
                ) : null,
              )}
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);
