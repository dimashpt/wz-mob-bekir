import React, { useState } from 'react';
import { View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { CalendarPicker } from '@/components/date-time-picker/calendar';
import { WheelTimePicker } from '@/components/date-time-picker/wheel-time-picker';

interface DateTimePickerProps {
  date?: Dayjs;
  mode?: 'calendar' | 'calendar-range' | 'wheel' | 'time';
  onDateChange?: (date: Dayjs) => void;
  onRangeChange?: (start: Dayjs, end: Dayjs | null) => void;
  enableRange?: boolean;
  onModeChange?: (mode: 'calendar' | 'wheel' | 'time') => void;
  onCancel?: () => void;
  onDone?: (date: Dayjs | { start: Dayjs; end: Dayjs }) => void;

  disabledDate?: (date: Dayjs) => boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  mode = 'calendar',
  onCancel,
  onDone,
  onDateChange,
  onRangeChange,

  disabledDate,
}) => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(date || dayjs());
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);

  const enableRange = mode === 'calendar-range';

  // Get the appropriate instruction message for range selection
  function getRangeInstructionMessage(): string | null {
    if (!enableRange) return null;

    if (!rangeStart) {
      return t('date_time_picker.range_instruction_start');
    } else if (!rangeEnd) {
      return t('date_time_picker.range_instruction_end');
    }
    return null;
  }

  function handleDateChange(newDate: Dayjs): void {
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  }

  function handleRangeSelect(start: Dayjs, end: Dayjs | null): void {
    setRangeStart(start);
    setRangeEnd(end);
    onRangeChange?.(start, end);
  }

  function handleDone(): void {
    if (enableRange) {
      if (rangeStart && rangeEnd) {
        onDone?.({ start: rangeStart, end: rangeEnd });
      }
    } else {
      onDone?.(selectedDate);
    }
  }

  function getSelectedDateRange(): string | null {
    // Return null if either rangeStart or rangeEnd is missing
    if (!rangeStart || !rangeEnd) {
      return null;
    }

    // If start and end dates are the same day
    if (rangeStart.isSame(rangeEnd, 'day')) {
      return rangeStart.format('D MMMM YYYY');
    }

    // If start and end dates are in the same month
    if (rangeStart.format('MMM') === rangeEnd.format('MMM')) {
      return `${rangeStart.format('D')}-${rangeEnd.format('D')} ${rangeStart.format('MMMM YYYY')}`;
    }

    // If start and end dates are in different months
    return `${rangeStart.format('D MMM')} - ${rangeEnd.format('D MMM YYYY')}`;
  }

  return (
    <View className="gap-lg">
      {/* Range Selection Instructions */}
      {enableRange && (
        <Banner
          variant="info"
          message={getRangeInstructionMessage() || getSelectedDateRange() || ''}
        />
      )}

      {(mode === 'calendar' || enableRange) && (
        <CalendarPicker
          initialDate={selectedDate}
          enableRange={enableRange}
          onSingleSelect={handleDateChange}
          onRangeSelect={handleRangeSelect}
          disabledDate={disabledDate}
        />
      )}

      {mode === 'time' && (
        <WheelTimePicker time={selectedDate} onTimeChange={handleDateChange} />
      )}

      <View className="border-border border-b" />

      <View className="gap-md flex-row">
        <Button
          text={t('general.cancel')}
          variant="outlined"
          color="secondary"
          className="flex-1"
          onPress={onCancel}
        />
        <Button
          text={t('general.done')}
          color="primary"
          className="flex-1"
          onPress={handleDone}
          disabled={enableRange ? !rangeStart || !rangeEnd : !selectedDate}
        />
      </View>
    </View>
  );
};

export * from './calendar';
export * from './wheel-date-picker';
export * from './wheel-time-picker';
