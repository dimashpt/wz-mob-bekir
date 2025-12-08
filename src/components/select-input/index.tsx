import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FlatListProps, Keyboard, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/icon';
import { InputField, InputFieldBaseProps } from '@/components/input-field';
import { Clickable } from '../clickable';
import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  RenderItemProps,
} from '../option-bottom-sheet';
import { Text } from '../text';

export interface SelectInputProps<TData = unknown> extends InputFieldBaseProps {
  options: Option<TData>[];
  onSelect: (value: Option<TData> | null) => void;
  selected?: Option<TData> | null;
  placeholder?: string;
  title?: string;
  hideTouchable?: boolean;
  renderItem?: (props: RenderItemProps<TData>) => React.ReactElement;
  flatListProps?: Omit<FlatListProps<Option<TData>>, 'data' | 'renderItem'>;
  search?: {
    onSearchChange?: (text: string) => void;
    placeholder?: string;
    isLoading?: boolean;
  };
}

export interface SelectInputRef {
  present: () => void;
  close: () => void;
}

function SelectInputInner<TData = unknown>(
  {
    options,
    onSelect,
    placeholder,
    label,
    selected = null,
    mandatory,
    title,
    hideTouchable = false,
    renderItem,
    flatListProps,
    ...props
  }: SelectInputProps<TData>,
  ref: React.ForwardedRef<SelectInputRef>,
): React.ReactElement {
  const bottomSheetRef = useRef<OptionBottomSheetRef>(null);

  const { t } = useTranslation();

  const [selectedValue, setSelectedValue] = useState<Option<TData> | null>(
    selected,
  );
  const defaultPlaceholder = placeholder ?? t('select_input.placeholder');

  function handleOptionSelect(value: Option<TData>): void {
    setSelectedValue((prevValue) => {
      const newValue = prevValue === value ? null : value;
      onSelect(newValue);
      return newValue;
    });
  }

  function handlePresentOptionModalPress(): void {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  }

  useImperativeHandle(ref, () => ({
    present: handlePresentOptionModalPress,
    close: () => bottomSheetRef.current?.close(),
  }));

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  return (
    <View className="gap-xs">
      {hideTouchable ? null : (
        <>
          <Text variant="labelS" className="font-medium">
            {label}
            {mandatory ? (
              <Text variant="labelM" color="danger" className="font-medium">
                *
              </Text>
            ) : null}
          </Text>
          <Clickable
            onPress={props.disabled ? undefined : handlePresentOptionModalPress}
            pointerEvents="box-only"
          >
            <InputField
              mandatory={mandatory}
              value={selectedValue?.label || ''}
              placeholder={defaultPlaceholder}
              editable={false}
              multiline
              right={
                <Icon
                  name="chevron"
                  size="base"
                  className="text-field-placeholder"
                />
              }
              {...props}
            />
          </Clickable>
        </>
      )}

      <OptionBottomSheet
        ref={bottomSheetRef}
        options={options}
        onSelect={handleOptionSelect}
        selectedValue={selectedValue}
        title={title ?? placeholder ?? label}
        renderItem={renderItem}
        flatListProps={{
          ...(props.search
            ? {
                stickyHeaderIndices: [0],
                ListHeaderComponent: (
                  <View className="px-md pb-sm bg-surface">
                    <InputField
                      left={
                        <Icon
                          name="search"
                          size="lg"
                          className="text-muted-foreground"
                        />
                      }
                      bottomSheet
                      className="rounded-full"
                      inputClassName="py-sm"
                      loading={props.search?.isLoading ?? false}
                      onChangeText={props.search?.onSearchChange}
                      placeholder={
                        props.search?.placeholder || t('general.search')
                      }
                    />
                  </View>
                ),
              }
            : {}),
          ...flatListProps,
        }}
      />
    </View>
  );
}

export const SelectInput = forwardRef(SelectInputInner) as <TData = unknown>(
  props: SelectInputProps<TData> & {
    ref?: React.ForwardedRef<SelectInputRef>;
  },
) => React.ReactElement;

export const MemoizedSelectInput = memo(SelectInput);
export default SelectInput;
