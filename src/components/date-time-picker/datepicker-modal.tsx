import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, View } from 'react-native';

import { BottomSheetHandle } from '@gorhom/bottom-sheet';
import { Dayjs } from 'dayjs';

import { BottomSheet, BottomSheetModal } from '@/components/bottom-sheet';
import { DateTimePicker } from '../date-time-picker';
import { Text } from '../text';

export interface DatePickerModalRef {
  present: () => void;
  close: () => void;
}

type BaseDatePickerModalProps = Omit<
  React.ComponentProps<typeof BottomSheetModal>,
  'ref' | 'children'
> & {
  onCancel?: () => void;
  onDone?: (date: Dayjs | { start: Dayjs; end: Dayjs }) => void;
  disabledDate?: (date: Dayjs) => boolean;
  title?: string;
};

// Single date mode props
interface SingleDatePickerModalProps extends BaseDatePickerModalProps {
  mode?: 'date' | 'wheel' | 'time' | 'datetime';
  value?: Dayjs | null;
  onSelect?: (value: Dayjs | null) => void;
  onRangeSelect?: never;
}

// Range date mode props
interface RangeDatePickerModalProps extends BaseDatePickerModalProps {
  mode: 'date-range';
  value?: { start: Dayjs; end: Dayjs } | null;
  onSelect?: never;
  onRangeSelect?: (range: { start: Dayjs; end: Dayjs }) => void;
}

export type DatePickerModalProps =
  | SingleDatePickerModalProps
  | RangeDatePickerModalProps;

export const DatePickerModal = forwardRef<
  DatePickerModalRef,
  DatePickerModalProps
>(function DatePickerModal(props, ref): React.JSX.Element {
  const { disabledDate, title, mode = 'date' } = props;
  const value = props.value;
  const onSelect = 'onSelect' in props ? props.onSelect : undefined;
  const onRangeSelect =
    'onRangeSelect' in props ? props.onRangeSelect : undefined;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedValue, setSelectedValue] = useState<Dayjs | null>(
    value && 'start' in value ? null : (value as Dayjs | null),
  );
  const [rangeValue, setRangeValue] = useState<{
    start: Dayjs;
    end: Dayjs;
  } | null>(
    value && typeof value === 'object' && 'start' in value ? value : null,
  );

  const enableRange = mode === 'date-range';

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
    bottomSheetRef.current?.present();
  }

  function closePicker(): void {
    bottomSheetRef.current?.dismiss();
  }

  function handleDateTimePickerDone(
    dateOrRange: Dayjs | { start: Dayjs; end: Dayjs },
  ): void {
    if (
      enableRange &&
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

  return (
    <BottomSheet.Modal
      ref={bottomSheetRef}
      handleComponent={
        !title
          ? undefined
          : (props) => (
              <BottomSheetHandle {...props}>
                <View className="bg-surface py-sm">
                  <Text variant="labelL" className="text-center">
                    {title}
                  </Text>
                </View>
              </BottomSheetHandle>
            )
      }
    >
      <BottomSheet.View detached>
        <DateTimePicker
          date={selectedValue ?? undefined}
          initialRange={rangeValue ?? undefined}
          mode={mode}
          enableRange={enableRange}
          onCancel={closePicker}
          onDone={handleDateTimePickerDone}
          disabledDate={disabledDate}
        />
      </BottomSheet.View>
    </BottomSheet.Modal>
  );
});
