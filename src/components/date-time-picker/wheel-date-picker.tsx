import React, { memo, useState } from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';

import ScrollPicker, { ScrollPickerProps } from '@/components/wheel-picker';

interface WheelDatePickerProps {
  date?: dayjs.Dayjs;
  onDateChange?: (date: dayjs.Dayjs) => void;
}

const WheelPicker = memo(ScrollPicker);

export const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  date = dayjs(),
  onDateChange,
}) => {
  const currentDate = date; // Current date
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Values for days, months, and years
  const daysInMonth = selectedDate.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    (i + 1).toString(),
  );

  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format('MMM'),
  );

  const startYear = currentDate.year() - 50;
  const endYear = currentDate.year() + 50;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString(),
  );

  // Handlers for changing day, month, and year
  const handleDayChange: NonNullable<
    ScrollPickerProps<string | number>['onValueChange']
  > = (data) => {
    if (data === undefined) return;

    setSelectedDate((prev) => {
      const newDate = prev.date(parseInt(data.toString()));
      onDateChange?.(newDate);
      return newDate;
    });
  };

  const handleMonthChange: NonNullable<
    ScrollPickerProps<string | number>['onValueChange']
  > = (_, index) =>
    setSelectedDate((prev) => {
      const newDate = prev.month(index);
      onDateChange?.(newDate);
      return newDate;
    });

  const handleYearChange: NonNullable<
    ScrollPickerProps<string | number>['onValueChange']
  > = (data) => {
    if (data === undefined) return;

    setSelectedDate((prev) => {
      const newDate = prev.year(parseInt(data.toString()));
      onDateChange?.(newDate);
      return newDate;
    });
  };

  return (
    <View className="gap-sm relative flex-row items-center justify-center">
      <View className="absolute z-0 h-full w-full items-center justify-center">
        <View className="h-5xl bg-primary-light z-0 w-full rounded-sm" />
      </View>
      {/* Days Picker */}
      <WheelPicker
        dataSource={days}
        selectedIndex={selectedDate.date() - 1}
        onValueChange={handleDayChange}
        wrapperBackground="transparent"
        wrapperHeight={152}
        itemHeight={40}
        itemTextStyle={{ fontSize: 14 }}
        activeItemTextStyle={{ fontSize: 18, lineHeight: 24 }}
        highlightBorderWidth={0}
      />

      {/* Months Picker */}
      <WheelPicker
        dataSource={months}
        selectedIndex={selectedDate.month()}
        onValueChange={handleMonthChange}
        wrapperBackground="transparent"
        wrapperHeight={152}
        itemHeight={40}
        highlightBorderWidth={0}
      />

      {/* Years Picker */}
      <WheelPicker
        dataSource={years}
        selectedIndex={years.indexOf(selectedDate.year().toString())}
        onValueChange={handleYearChange}
        wrapperBackground="transparent"
        wrapperHeight={152}
        itemHeight={40}
        highlightBorderWidth={0}
      />
    </View>
  );
};
