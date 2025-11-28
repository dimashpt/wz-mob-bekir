import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatListProps,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

import { Illustrations } from '@/assets/illustrations';
import { BottomSheet, BottomSheetModal } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Button } from '../button';

export interface Option<TData = unknown> {
  value: string;
  label: string;
  data?: TData;
}

export type RenderItemProps<TData = unknown> = {
  item: Option<TData>;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
};

type BaseOptionBottomSheetProps<TData = unknown> = {
  options: Option<TData>[];
  title?: string;
  renderItem?: (props: RenderItemProps<TData>) => React.ReactElement;
  flatListProps?: Omit<FlatListProps<Option<TData>>, 'data' | 'renderItem'>;
};

type SingleSelectOptionBottomSheetProps<TData = unknown> =
  BaseOptionBottomSheetProps<TData> & {
    multiselect?: false;
    onSelect: (value: Option<TData>) => void;
    selectedValue?: Option<TData> | null;
    selectedValues?: never;
  };

type MultiSelectOptionBottomSheetProps<TData = unknown> =
  BaseOptionBottomSheetProps<TData> & {
    multiselect: true;
    onSelect: (value: Option<TData>[]) => void;
    selectedValue?: never;
    selectedValues?: Option<TData>[];
  };

export type OptionBottomSheetProps<TData = unknown> =
  | SingleSelectOptionBottomSheetProps<TData>
  | MultiSelectOptionBottomSheetProps<TData>;

export interface OptionBottomSheetRef {
  present: () => void;
  close: () => void;
}

const { height, width } = Dimensions.get('window');

function OptionBottomSheetInner<TData = unknown>(
  {
    options,
    onSelect,
    selectedValue,
    title,
    multiselect = false,
    selectedValues = [],
    renderItem,
    flatListProps,
  }: OptionBottomSheetProps<TData>,
  ref: React.ForwardedRef<OptionBottomSheetRef>,
): React.ReactElement {
  const { t } = useTranslation();
  const accentColor = useCSSVariable('--color-accent') as string;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [internalSelectedValues, setInternalSelectedValues] = useState<
    Option<TData>[]
  >(selectedValues as Option<TData>[]);

  // Sync internal state with prop when it changes
  React.useEffect(() => {
    if (multiselect) {
      setInternalSelectedValues(selectedValues as Option<TData>[]);
    }
  }, [selectedValues, multiselect]);

  function handleOptionSelect(option: Option<TData>): void {
    if (multiselect) {
      const isSelected = internalSelectedValues.some(
        (item) => item.value === option.value,
      );
      const newSelectedValues = isSelected
        ? internalSelectedValues.filter((item) => item.value !== option.value)
        : [...internalSelectedValues, option];
      setInternalSelectedValues(newSelectedValues);
    } else {
      (onSelect as (value: Option<TData>) => void)(option);
      bottomSheetModalRef.current?.close();
    }
  }

  function handleDone(): void {
    if (multiselect) {
      (onSelect as (value: Option<TData>[]) => void)(internalSelectedValues);
      bottomSheetModalRef.current?.close();
    }
  }

  function handleReset(): void {
    if (multiselect) {
      setInternalSelectedValues([]);
    }
  }

  function isOptionSelected(option: Option<TData>): boolean {
    if (multiselect) {
      return internalSelectedValues.some((item) => item.value === option.value);
    }
    return option.value === selectedValue?.value;
  }

  useImperativeHandle(ref, () => ({
    present: () => {
      // Reset internal state to match prop values when opening
      if (multiselect) {
        setInternalSelectedValues(selectedValues as Option<TData>[]);
      }
      bottomSheetModalRef.current?.present();
    },
    close: () => bottomSheetModalRef.current?.close(),
  }));

  function handleDismiss(): void {
    // Reset internal state to match prop values when dismissed without "Done"
    if (multiselect) {
      setInternalSelectedValues(selectedValues as Option<TData>[]);
    }
  }

  return (
    <BottomSheet.Modal
      ref={bottomSheetModalRef}
      maxDynamicContentSize={height / 2}
      onDismiss={handleDismiss}
      footerComponent={
        !multiselect
          ? undefined
          : (props) => (
              <BottomSheetFooter {...props}>
                <View className="p-md gap-sm border-border bg-surface flex-row rounded-b-lg border-t">
                  <Button
                    text="Reset"
                    variant="outlined"
                    onPress={handleReset}
                    className="flex-1"
                  />
                  <Button
                    text="Done"
                    variant="filled"
                    color="primary"
                    onPress={handleDone}
                    className="flex-1"
                  />
                </View>
              </BottomSheetFooter>
            )
      }
      handleComponent={(props) => (
        <BottomSheetHandle {...props}>
          <View className="bg-surface py-sm">
            <Text variant="labelL" className="text-center">
              {title}
            </Text>
          </View>
        </BottomSheetHandle>
      )}
    >
      <BottomSheetFlatList
        {...flatListProps}
        data={options}
        enableFooterMarginAdjustment
        renderItem={({
          item: option,
          index,
        }: {
          item: Option<TData>;
          index: number;
        }) => {
          const isLastItem = index === options.length - 1;

          return (
            <TouchableHighlight
              onPress={() => handleOptionSelect(option)}
              underlayColor="#00000011"
              className={twMerge(
                'w-full flex-row',
                isOptionSelected(option) ? 'bg-accent-soft' : '',
                isLastItem ? 'rounded-b-lg' : '',
              )}
            >
              {renderItem ? (
                renderItem({
                  item: option,
                  index,
                  isSelected: isOptionSelected(option),
                  onSelect: () => handleOptionSelect(option),
                })
              ) : (
                <View
                  className={twMerge(
                    'py-md px-lg w-full flex-row items-center',
                    options.length !== index + 1 && 'border-border border-b',
                  )}
                >
                  <Text variant="bodyS" className="shrink">
                    {option.label}
                  </Text>
                  <View className="flex-1" />
                  {isOptionSelected(option) && (
                    <Icon name="tickCircle" size="lg" className="text-accent" />
                  )}
                </View>
              )}
            </TouchableHighlight>
          );
        }}
        ListEmptyComponent={() => (
          <View className="gap-sm py-xl flex-1 items-center justify-center">
            <Illustrations.NoData
              color={accentColor}
              width={width / 3}
              height={width / 3}
            />
            <Text variant="bodyM" className="text-center">
              {t('general.no_data')}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: multiselect ? 0 : undefined,
        }}
        showsVerticalScrollIndicator
      />
    </BottomSheet.Modal>
  );
}

export const OptionBottomSheet = forwardRef(OptionBottomSheetInner) as <
  TData = unknown,
>(
  props: OptionBottomSheetProps<TData> & {
    ref?: React.ForwardedRef<OptionBottomSheetRef>;
  },
) => React.ReactElement;
