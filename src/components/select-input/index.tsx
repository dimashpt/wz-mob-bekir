import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/icon';
import { InputField } from '@/components/input-field';
import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '../option-bottom-sheet';

export interface SelectInputProps
  extends React.ComponentProps<typeof InputField> {
  options: Option[];
  onSelect: (value: Option | null) => void;
  selected?: Option | null;
  placeholder?: string;
  title?: string;
  hideTouchable?: boolean;
}

export interface SelectInputRef {
  present: () => void;
  close: () => void;
}

export const SelectInput = forwardRef<SelectInputRef, SelectInputProps>(
  (
    {
      options,
      onSelect,
      placeholder,
      label,
      selected = null,
      mandatory,
      title,
      hideTouchable = false,

      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [selectedValue, setSelectedValue] = useState<Option | null>(selected);
    const bottomSheetRef = useRef<OptionBottomSheetRef>(null);
    const defaultPlaceholder = placeholder ?? t('select_input.placeholder');

    function handleOptionSelect(value: Option): void {
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
      <View>
        {hideTouchable ? null : (
          <TouchableWithoutFeedback
            onPress={props.disabled ? undefined : handlePresentOptionModalPress}
          >
            <View pointerEvents="box-only">
              <InputField
                label={label}
                mandatory={mandatory}
                value={selectedValue?.label || ''}
                placeholder={defaultPlaceholder}
                editable={false}
                right={
                  <Icon
                    name="chevron"
                    size="base"
                    className="text-field-placeholder"
                  />
                }
                {...props}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        <OptionBottomSheet
          ref={bottomSheetRef}
          options={options}
          onSelect={handleOptionSelect}
          selectedValue={selectedValue}
          title={title ?? placeholder ?? label}
        />
      </View>
    );
  },
);

export const MemoizedSelectInput = memo(SelectInput);
export default SelectInput;
