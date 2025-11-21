import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import dayjs, { Dayjs } from 'dayjs';

import {
  DatePickerModal,
  DatePickerModalRef,
} from '@/components/date-time-picker/datepicker-modal';
import { formatSmartDateRange } from '@/utils/date';
import { FilterChip } from './filter-chip';
import { isDateRangeFilter } from './helpers/filter-helpers';
import { DateFilter as DateFilterType } from './types';

export interface DateFilterRef {
  clear: () => void;
  getValue: () => Dayjs | null | { start: Dayjs; end: Dayjs };
  isActive: () => boolean;
}

interface DateFilterProps {
  filter: DateFilterType;
  onActiveChange?: (isActive: boolean) => void;
}

/**
 * DateFilter component that renders a filter chip with date/date-range selection via modal.
 * Manages its own state when uncontrolled, or uses controlled value prop.
 * Supports various date picker modes: calendar, calendar-range, wheel, and time.
 */
export const DateFilter = forwardRef<DateFilterRef, DateFilterProps>(
  function DateFilter({ filter, onActiveChange }, ref): React.ReactNode {
    const [internalValue, setInternalValue] = useState<
      Dayjs | null | { start: Dayjs; end: Dayjs }
    >(null);
    const datePickerRef = useRef<DatePickerModalRef>(null);

    const isControlled = filter.value !== undefined;
    const value = isControlled ? filter.value : internalValue;
    const isActive = Boolean(value);

    // Notify parent of initial active state
    useEffect(() => {
      onActiveChange?.(isActive);
    }, [isActive, onActiveChange]);

    function handlePress(): void {
      datePickerRef.current?.present();
    }

    function handleDateSelect(date: Dayjs | null): void {
      if (!isControlled) {
        setInternalValue(date);
      }

      filter.onChange?.(date);
      onActiveChange?.(Boolean(date));
    }

    function handleDateRangeSelect(range: { start: Dayjs; end: Dayjs }): void {
      if (!isControlled) {
        setInternalValue(range);
      }

      filter.onChange?.(range);
      onActiveChange?.(true);
    }

    function clear(): void {
      const newValue = null;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      filter.onChange?.(newValue);
      onActiveChange?.(false);
    }

    function getValue(): Dayjs | null | { start: Dayjs; end: Dayjs } {
      return value ?? null;
    }

    function isActiveValue(): boolean {
      return isActive;
    }

    useImperativeHandle(ref, () => ({
      clear,
      getValue,
      isActive: isActiveValue,
    }));

    function getDisplayLabel(): string {
      if (!value) return filter.label;

      // Handle range case
      if (
        filter.mode === 'calendar-range' &&
        typeof value === 'object' &&
        'start' in value &&
        'end' in value
      ) {
        return formatSmartDateRange([value.start, value.end]);
      }

      // Handle single date case (check if it's a Dayjs object)
      if (dayjs.isDayjs(value)) {
        // Format date based on mode
        const format =
          filter.mode === 'time'
            ? 'HH:mm'
            : filter.mode === 'wheel'
              ? 'DD MMM YYYY'
              : 'DD MMM YYYY';

        return value.format(format);
      }

      return filter.label;
    }

    const isRange = isDateRangeFilter(filter);

    return (
      <>
        <FilterChip
          label={getDisplayLabel()}
          isActive={isActive}
          onPress={handlePress}
          showChevron={true}
        />

        <DatePickerModal
          ref={datePickerRef}
          title={filter.label}
          value={isRange ? null : (value as Dayjs | null)}
          mode={filter.mode}
          disabledDate={filter.disabledDate}
          {...(isRange
            ? {
                onRangeSelect: (range: { start: Dayjs; end: Dayjs }) =>
                  handleDateRangeSelect(range),
              }
            : {
                onSelect: (date: Dayjs | null) => handleDateSelect(date),
              })}
        />
      </>
    );
  },
);
