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

type BaseSelectDateTimeProps = Omit<
  React.ComponentProps<typeof InputField>,
  'value' | 'mode' | 'onChange'
> & {
  placeholder?: string;
  label?: string;
  mandatory?: boolean;
  hideTouchable?: boolean;
  disabledDate?: (date: Dayjs) => boolean;
};

// Single date mode props
interface SingleDateModeProps extends BaseSelectDateTimeProps {
  mode?: 'date' | 'wheel' | 'time' | 'datetime';
  enableRange?: false;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
}

// Range date mode props
interface RangeDateModeProps extends BaseSelectDateTimeProps {
  mode: 'date-range';
  enableRange?: true;
  value?: { start: Dayjs; end: Dayjs } | null;
  onChange?: (range: { start: Dayjs; end: Dayjs }) => void;
}

// Enable range with calendar mode
interface EnableRangeModeProps extends BaseSelectDateTimeProps {
  mode?: 'date';
  enableRange: true;
  value?: { start: Dayjs; end: Dayjs } | null;
  onChange?: (range: { start: Dayjs; end: Dayjs }) => void;
}

export type SelectDateTimeProps =
  | SingleDateModeProps
  | RangeDateModeProps
  | EnableRangeModeProps;

export const SelectDateTime = forwardRef<
  SelectDateTimeRef,
  SelectDateTimeProps
>((props, ref) => {
  const {
    value = null,
    placeholder = 'Select date/time',
    label,
    mode = 'date',
    mandatory,
    hideTouchable = false,
    disabledDate,
    ...restPropsWithExtra
  } = props;

  // Extract onChange and enableRange separately to avoid type conflicts
  const onChange = 'onChange' in props ? props.onChange : undefined;
  const enableRange = 'enableRange' in props ? props.enableRange : false;

  // Remove onChange and enableRange from restProps
  const { onChange: _, enableRange: __, ...restProps } = restPropsWithExtra;

  const [selectedValue, setSelectedValue] = useState<Dayjs | null>(
    value && 'start' in value ? null : (value as Dayjs | null),
  );
  const [rangeValue, setRangeValue] = useState<{
    start: Dayjs;
    end: Dayjs;
  } | null>(
    value && typeof value === 'object' && 'start' in value ? value : null,
  );
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
    if (value && typeof value === 'object' && 'start' in value) {
      setRangeValue(value);
      setSelectedValue(null);
    } else {
      setSelectedValue(value as Dayjs | null);
      setRangeValue(null);
    }
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
      if (onChange) {
        (onChange as (range: { start: Dayjs; end: Dayjs }) => void)(
          dateOrRange,
        );
      }
    } else {
      const date = dateOrRange as Dayjs;
      setSelectedValue(date);
      closePicker();
      if (onChange) {
        (onChange as (value: Dayjs | null) => void)(date);
      }
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
              {...restProps}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <BottomSheetModal ref={bottomSheetRef}>
        <BottomSheet.View detached>
          <DateTimePicker
            key={pickerKey}
            date={selectedValue ?? undefined}
            initialRange={rangeValue ?? undefined}
            mode={mode === 'date-range' ? 'date-range' : mode}
            enableRange={isRangeMode}
            onCancel={closePicker}
            onDone={handleDateTimePickerDone}
            disabledDate={disabledDate}
          />
        </BottomSheet.View>
      </BottomSheetModal>
    </>
  );
});
