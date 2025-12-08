import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';

import { BottomSheet, BottomSheetModal } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { formatSmartDateRange } from '@/utils/date';
import { InputField } from '../input-field';
import { DateTimePicker } from './date-time-picker';

export interface SelectDateTimeRef {
  present: () => void;
  close: () => void;
}

export interface SelectDateTimeProps extends Omit<
  React.ComponentProps<typeof InputField>,
  'value' | 'mode'
> {
  value?: Dayjs | null;
  onSelect?: (value: Dayjs | null) => void;
  onRangeSelect?: (range: { start: Dayjs; end: Dayjs }) => void;
  enableRange?: boolean;
  placeholder?: string;
  label?: string;
  mode?: 'calendar' | 'date-range' | 'wheel' | 'time' | 'datetime';
  mandatory?: boolean;
  hideTouchable?: boolean;

  disabledDate?: (date: Dayjs) => boolean;
}

export const SelectDateTime = forwardRef<
  SelectDateTimeRef,
  SelectDateTimeProps
>(
  (
    {
      value = null,
      onSelect,
      onRangeSelect,
      enableRange = false,
      placeholder = 'Select date/time',
      label,
      mode = 'calendar',
      mandatory,
      hideTouchable = false,

      disabledDate,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useState<Dayjs | null>(value);
    const [rangeValue, setRangeValue] = useState<{
      start: Dayjs;
      end: Dayjs;
    } | null>(null);
    const [pickerKey, setPickerKey] = useState<number>(0);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const isRangeMode = enableRange || mode === 'date-range';

    const format =
      mode === 'time'
        ? 'HH : mm'
        : mode === 'datetime'
          ? 'D MMMM YYYY, HH:mm'
          : 'D MMMM YYYY';

    useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    function openPicker(): void {
      Keyboard.dismiss();
      // Increment key to reset DateTimePicker state when picker opens
      setPickerKey((prev) => prev + 1);
      bottomSheetRef.current?.present();
    }

    function closePicker(): void {
      bottomSheetRef.current?.close();
    }

    function handleDateTimePickerDone(
      dateOrRange: Dayjs | { start: Dayjs; end: Dayjs },
    ): void {
      if (
        isRangeMode &&
        typeof dateOrRange === 'object' &&
        'start' in dateOrRange &&
        'end' in dateOrRange
      ) {
        setRangeValue(dateOrRange);
        closePicker();
        onRangeSelect?.(dateOrRange);
      } else {
        const date = dateOrRange as Dayjs;
        setSelectedValue(date);
        closePicker();
        onSelect?.(date);
      }
    }

    useImperativeHandle(ref, () => ({
      present: openPicker,
      close: closePicker,
    }));

    function getDisplayValue(): string {
      // Handle range case
      if (isRangeMode && rangeValue) {
        const { start, end } = rangeValue;
        return formatSmartDateRange([start, end]);
      }

      // Handle single date case
      if (selectedValue && dayjs(selectedValue).isValid()) {
        return selectedValue.format(format);
      }

      // Default empty
      return '';
    }

    return hideTouchable ? null : (
      <>
        <View>
          <TouchableWithoutFeedback onPress={openPicker}>
            <View pointerEvents="box-only">
              <InputField
                label={label}
                mandatory={mandatory}
                value={getDisplayValue()}
                placeholder={placeholder}
                editable={false}
                right={
                  mode === 'time' || mode === 'datetime' ? (
                    <Icon
                      name="clock"
                      size="base"
                      className="text-field-placeholder"
                    />
                  ) : (
                    <Icon
                      name="calendar"
                      size="base"
                      className="text-field-placeholder"
                    />
                  )
                }
                {...props}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <BottomSheetModal ref={bottomSheetRef}>
          <BottomSheet.View detached>
            <DateTimePicker
              key={pickerKey}
              date={selectedValue ?? undefined}
              mode={mode === 'date-range' ? 'calendar-range' : mode}
              enableRange={isRangeMode}
              onCancel={closePicker}
              onDone={handleDateTimePickerDone}
              disabledDate={disabledDate}
            />
          </BottomSheet.View>
        </BottomSheetModal>
      </>
    );
  },
);
