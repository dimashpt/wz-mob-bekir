import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';
import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

dayjs.extend(weekday);
dayjs.extend(isLeapYear);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

interface CalendarPickerProps {
  initialDate?: Dayjs;
  enableRange?: boolean;
  onSingleSelect?: (date: Dayjs) => void;
  onRangeSelect?: (start: Dayjs, end: Dayjs | null) => void;

  disabledDate?: (date: Dayjs) => boolean;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  initialDate,
  enableRange = false,
  onSingleSelect,
  onRangeSelect,

  disabledDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    initialDate || dayjs(),
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate || null,
  );
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);

  function handleDayPress(date: Dayjs): void {
    // Check if date is disabled
    if (disabledDate?.(date)) {
      return;
    }

    if (enableRange) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
        onRangeSelect?.(date, null);
      } else if (date.isBefore(rangeStart)) {
        setRangeStart(date);
        setRangeEnd(null);
        onRangeSelect?.(date, null);
      } else {
        setRangeEnd(date);
        onRangeSelect?.(rangeStart, date);
      }
    } else {
      setSelectedDate(date);
      onSingleSelect?.(date);
    }
  }

  function handleMonthChange(direction: 'prev' | 'next'): void {
    setCurrentMonth((prev) =>
      direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month'),
    );
  }

  /**
   * Check if all dates in a given month are disabled
   * @param month - The month to check
   * @returns true if all dates in the month are disabled, false otherwise
   */
  function isMonthCompletelyDisabled(month: Dayjs): boolean {
    if (!disabledDate) return false;

    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');

    // Check each day in the month
    for (
      let day = startOfMonth;
      day.isSameOrBefore(endOfMonth, 'day');
      day = day.add(1, 'day')
    ) {
      if (!disabledDate(day)) {
        return false; // Found at least one enabled date
      }
    }

    return true; // All dates are disabled
  }

  function generateDaysInMonth(): { date: Dayjs; isCurrentMonth: boolean }[] {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    // Use isoWeekday() to ensure Monday = 1, Sunday = 7 regardless of locale
    const firstDayOfWeek = startOfMonth.isoWeekday(); // 1 = Monday, 7 = Sunday

    const days: { date: Dayjs; isCurrentMonth: boolean }[] = [];

    // Add days from previous month for leading empty spaces
    const prevMonth = currentMonth.subtract(1, 'month');
    const prevMonthEnd = prevMonth.endOf('month');
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
      days.push({
        date: prevMonthEnd.subtract(i - 1, 'day'),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let i = 1; i <= endOfMonth.date(); i++) {
      days.push({
        date: currentMonth.date(i),
        isCurrentMonth: true,
      });
    }

    // Add days from next month for trailing empty spaces
    const nextMonth = currentMonth.add(1, 'month');
    let nextMonthDay = 1;
    while (days.length % 7 !== 0) {
      days.push({
        date: nextMonth.date(nextMonthDay),
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    return days;
  }

  const daysInMonth = generateDaysInMonth();

  // Check if navigation should be disabled
  const prevMonth = currentMonth.subtract(1, 'month');
  const nextMonth = currentMonth.add(1, 'month');
  const isPrevMonthDisabled = isMonthCompletelyDisabled(prevMonth);
  const isNextMonthDisabled = isMonthCompletelyDisabled(nextMonth);

  return (
    <View className="gap-md">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => handleMonthChange('prev')}
          disabled={isPrevMonthDisabled}
          className={twMerge(
            'size-6 items-center justify-center',
            isPrevMonthDisabled && 'opacity-30',
          )}
        >
          <Icon
            name="chevron"
            size={24}
            transform={[{ rotate: '90deg' }]}
            className={isPrevMonthDisabled ? 'text-muted' : 'text-foreground'}
          />
        </TouchableOpacity>
        <Text variant="labelXL">{currentMonth.format('MMMM YYYY')}</Text>
        <TouchableOpacity
          onPress={() => handleMonthChange('next')}
          disabled={isNextMonthDisabled}
          className={twMerge(
            'size-6 items-center justify-center',
            isNextMonthDisabled && 'opacity-30',
          )}
        >
          <Icon
            name="chevron"
            size={24}
            transform={[{ rotate: '270deg' }]}
            className={isNextMonthDisabled ? 'text-muted' : 'text-foreground'}
          />
        </TouchableOpacity>
      </View>

      <View className="gap-xs">
        {/* Weekdays */}
        <View className="flex-row">
          {Array.from({ length: 7 }, (_, i) => {
            // Use isoWeekday to ensure Monday = 1, Sunday = 7 regardless of locale
            const dayIndex = i + 1; // 1 = Monday, 7 = Sunday
            const dayName = dayjs().isoWeekday(dayIndex).format('ddd');
            const isWeekendDay = dayIndex === 6 || dayIndex === 7; // Saturday = 6, Sunday = 7

            return (
              <Text
                key={dayIndex}
                variant="labelM"
                color={isWeekendDay ? 'danger' : 'default'}
                className="flex-1 text-center"
              >
                {dayName}
              </Text>
            );
          })}
        </View>

        {/* Days Grid */}
        <View className="flex-row flex-wrap items-center">
          {daysInMonth.map((dayItem, index) => {
            const { date: thisDate, isCurrentMonth } = dayItem;
            const isDateDisabled = !!(thisDate && disabledDate?.(thisDate));

            // Check if the date is a weekend (Saturday = 6, Sunday = 0)
            const isWeekend =
              thisDate && (thisDate.day() === 0 || thisDate.day() === 6);

            const isToday =
              isCurrentMonth && thisDate && thisDate.isSame(dayjs(), 'day');

            const isSelected =
              !enableRange && thisDate && selectedDate?.isSame(thisDate, 'day');

            const isRangeStart =
              enableRange && rangeStart && thisDate?.isSame(rangeStart, 'day');

            const isRangeEnd =
              enableRange && rangeEnd && thisDate?.isSame(rangeEnd, 'day');

            const isRangeEqual = enableRange && rangeStart?.isSame(rangeEnd);

            const isInRange =
              enableRange &&
              rangeStart &&
              rangeEnd &&
              !isRangeEqual &&
              thisDate &&
              thisDate.isAfter(rangeStart, 'day') &&
              thisDate.isBefore(rangeEnd, 'day');

            const isSelectedOrInRange =
              isSelected || isInRange || isRangeStart || isRangeEnd;

            return (
              <TouchableOpacity
                key={`date-${thisDate.format('YYYY-MM-DD')}-${index}`}
                disabled={isDateDisabled}
                onPress={() => handleDayPress(thisDate)}
                className={twMerge(
                  'aspect-square w-[14.285%] items-center justify-center',
                  isSelected && 'bg-accent rounded-full',
                  isRangeStart &&
                    !isRangeEqual &&
                    'bg-accent rounded-full rounded-tr-none rounded-br-none',
                  isRangeEnd &&
                    !isRangeEqual &&
                    'bg-accent rounded-full rounded-tl-none rounded-bl-none',
                  isRangeEqual &&
                    (isRangeStart || isRangeEnd) &&
                    'bg-accent rounded-full',
                  isInRange && !isRangeStart && !isRangeEnd && 'bg-accent',
                  isToday &&
                    !isSelectedOrInRange &&
                    'border-accent rounded-full border-2',
                  (isDateDisabled || !isCurrentMonth) &&
                    !isSelectedOrInRange &&
                    'opacity-15',
                )}
              >
                <Text
                  variant={
                    isSelected || isRangeStart || isRangeEnd
                      ? 'headingS'
                      : 'bodyL'
                  }
                  color={
                    isWeekend &&
                    !isSelected &&
                    !isRangeStart &&
                    !isRangeEnd &&
                    !isInRange
                      ? 'danger'
                      : 'default'
                  }
                  className={twMerge(isSelectedOrInRange && 'text-white')}
                  style={Platform.OS === 'ios' ? undefined : { lineHeight: 24 }}
                >
                  {thisDate.date()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
