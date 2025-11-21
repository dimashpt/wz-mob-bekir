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

export interface DatePickerModalProps
  extends Omit<
    React.ComponentProps<typeof BottomSheetModal>,
    'ref' | 'children'
  > {
  value?: Dayjs | null;
  onSelect?: (value: Dayjs | null) => void;
  onRangeSelect?: (range: { start: Dayjs; end: Dayjs }) => void;
  mode?: 'calendar' | 'calendar-range' | 'wheel' | 'time';
  onCancel?: () => void;
  onDone?: (date: Dayjs | { start: Dayjs; end: Dayjs }) => void;
  disabledDate?: (date: Dayjs) => boolean;
  title?: string;
}

export const DatePickerModal = forwardRef<
  DatePickerModalRef,
  DatePickerModalProps
>(function DatePickerModal(
  {
    value = null,
    onSelect,
    onRangeSelect,
    mode = 'calendar',
    disabledDate,
    title,
  },
  ref,
): React.JSX.Element {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedValue, setSelectedValue] = useState<Dayjs | null>(value);
  const [, setRangeValue] = useState<{
    start: Dayjs;
    end: Dayjs;
  } | null>(null);

  const enableRange = mode === 'calendar-range';

  useEffect(() => {
    setSelectedValue(value);
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
