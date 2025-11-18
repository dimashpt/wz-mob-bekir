import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { twMerge } from 'tailwind-merge';

import { BottomSheetModal } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export interface Option {
  value: string;
  label: string;
  detail?: string;
}

export interface OptionBottomSheetProps {
  options: Option[];
  onSelect: (value: Option) => void;
  selectedValue?: Option | null;
  title?: string;
}

export interface OptionBottomSheetRef {
  present: () => void;
  close: () => void;
}

const { height } = Dimensions.get('window');

export const OptionBottomSheet = forwardRef<
  OptionBottomSheetRef,
  OptionBottomSheetProps
>(({ options, onSelect, selectedValue, title }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  function handleOptionSelect(option: Option): void {
    onSelect(option);
    bottomSheetModalRef.current?.close();
  }

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      maxDynamicContentSize={height / 2}
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
              {option.value === selectedValue?.value && (
                <Icon name="tick" size={24} className="text-accent" />
              )}
            </View>
          </TouchableHighlight>
        )}
        style={{ maxHeight: height / 2 }}
        showsVerticalScrollIndicator
        stickyHeaderIndices={[0]}
      />
    </BottomSheetModal>
  );
});
