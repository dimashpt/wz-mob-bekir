import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { twMerge } from 'tailwind-merge';

import { BottomSheetModal } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export interface Option {
  value: string;
  label: string;
  detail?: string;
}

type BaseOptionBottomSheetProps = {
  options: Option[];
  title?: string;
};

type SingleSelectOptionBottomSheetProps = BaseOptionBottomSheetProps & {
  multiselect?: false;
  onSelect: (value: Option) => void;
  selectedValue?: Option | null;
  selectedValues?: never;
};

type MultiSelectOptionBottomSheetProps = BaseOptionBottomSheetProps & {
  multiselect: true;
  onSelect: (value: Option[]) => void;
  selectedValue?: never;
  selectedValues?: Option[];
};

export type OptionBottomSheetProps =
  | SingleSelectOptionBottomSheetProps
  | MultiSelectOptionBottomSheetProps;

export interface OptionBottomSheetRef {
  present: () => void;
  close: () => void;
}

const { height } = Dimensions.get('window');

export const OptionBottomSheet = forwardRef<
  OptionBottomSheetRef,
  OptionBottomSheetProps
>(
  (
    {
      options,
      onSelect,
      selectedValue,
      title,
      multiselect = false,
      selectedValues = [],
    },
    ref,
  ) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [internalSelectedValues, setInternalSelectedValues] =
      useState<Option[]>(selectedValues);

    // Sync internal state with prop when it changes
    React.useEffect(() => {
      if (multiselect) {
        setInternalSelectedValues(selectedValues);
      }
    }, [selectedValues, multiselect]);

    function handleOptionSelect(option: Option): void {
      if (multiselect) {
        const isSelected = internalSelectedValues.some(
          (item) => item.value === option.value,
        );
        const newSelectedValues = isSelected
          ? internalSelectedValues.filter((item) => item.value !== option.value)
          : [...internalSelectedValues, option];
        setInternalSelectedValues(newSelectedValues);
      } else {
        (onSelect as (value: Option) => void)(option);
        bottomSheetModalRef.current?.close();
      }
    }

    function handleDone(): void {
      if (multiselect) {
        (onSelect as (value: Option[]) => void)(internalSelectedValues);
        bottomSheetModalRef.current?.close();
      }
    }

    function handleReset(): void {
      if (multiselect) {
        setInternalSelectedValues([]);
      }
    }

    function isOptionSelected(option: Option): boolean {
      if (multiselect) {
        return internalSelectedValues.some(
          (item) => item.value === option.value,
        );
      }
      return option.value === selectedValue?.value;
    }

    useImperativeHandle(ref, () => ({
      present: () => {
        // Reset internal state to match prop values when opening
        if (multiselect) {
          setInternalSelectedValues(selectedValues);
        }
        bottomSheetModalRef.current?.present();
      },
      close: () => bottomSheetModalRef.current?.close(),
    }));

    function handleDismiss(): void {
      // Reset internal state to match prop values when dismissed without "Done"
      if (multiselect) {
        setInternalSelectedValues(selectedValues);
      }
    }

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        maxDynamicContentSize={height / 2}
        onDismiss={handleDismiss}
      >
        <BottomSheetFlatList
          data={options}
          ListHeaderComponent={
            !title
              ? undefined
              : () => (
                  <View className="bg-surface pb-md">
                    <Text variant="labelL" className="text-center">
                      {title}
                    </Text>
                  </View>
                )
          }
          renderItem={({
            item: option,
            index,
          }: {
            item: Option;
            index: number;
          }) => (
            <TouchableHighlight
              onPress={() => handleOptionSelect(option)}
              underlayColor="#00000011"
              className="w-full flex-row"
            >
              <View
                className={twMerge(
                  'py-md px-md w-full flex-row items-center',
                  options.length !== index + 1 && 'border-border border-b',
                )}
              >
                <Text variant="bodyS">{option.label}</Text>
                {option.detail && <Text>{option.detail}</Text>}
                <View className="flex-1" />
                {isOptionSelected(option) && (
                  <Icon name="tickCircle" size="lg" className="text-accent" />
                )}
              </View>
            </TouchableHighlight>
          )}
          style={{ maxHeight: height / 2 }}
          showsVerticalScrollIndicator
          stickyHeaderIndices={[0]}
          ListFooterComponent={
            multiselect
              ? () => (
                  <View className="pt-md pb-lg px-md gap-sm flex-row">
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
                )
              : undefined
          }
        />
      </BottomSheetModal>
    );
  },
);
