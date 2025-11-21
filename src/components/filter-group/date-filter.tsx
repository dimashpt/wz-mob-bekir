import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Dayjs } from 'dayjs';

import {
  DatePickerModal,
  DatePickerModalRef,
} from '@/components/date-time-picker/datepicker-modal';
import { formatSmartDateRange } from '@/utils/date';
import { FilterChip } from './filter-chip';
import {
  DateFilter as DateFilterType,
  DateRangeFilter as DateRangeFilterType,
} from './types';

export interface DateFilterRef {
  clear: () => void;
  getValue: () => Dayjs | null;
  isActive: () => boolean;
}

export interface DateRangeFilterRef {
  clear: () => void;
  getValue: () => { start: Dayjs; end: Dayjs } | null;
  isActive: () => boolean;
}

interface DateFilterProps {
  filter: DateFilterType;
  onActiveChange?: (isActive: boolean) => void;
}

interface DateRangeFilterProps {
  filter: DateRangeFilterType;
  onActiveChange?: (isActive: boolean) => void;
}

/**
 * DateFilter component that renders a filter chip with single date selection via modal.
 * Manages its own state when uncontrolled, or uses controlled value prop.
 */
export const DateFilter = forwardRef<DateFilterRef, DateFilterProps>(
  function DateFilter({ filter, onActiveChange }, ref): React.ReactNode {
    const [internalValue, setInternalValue] = useState<Dayjs | null>(null);
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

    function clear(): void {
      const newValue = null;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      filter.onChange?.(newValue);
      onActiveChange?.(false);
    }

    function getValue(): Dayjs | null {
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

      return value.format('DD MMM YYYY');
    }

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
          value={value}
          mode="calendar"
          disabledDate={filter.disabledDate}
          onSelect={handleDateSelect}
        />
      </>
    );
  },
);

/**
 * DateRangeFilter component that renders a filter chip with date range selection via modal.
 * Manages its own state when uncontrolled, or uses controlled value prop.
 */
export const DateRangeFilter = forwardRef<
  DateRangeFilterRef,
  DateRangeFilterProps
>(function DateRangeFilter({ filter, onActiveChange }, ref): React.ReactNode {
  const [internalValue, setInternalValue] = useState<{
    start: Dayjs;
    end: Dayjs;
  } | null>(null);
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

  function getValue(): { start: Dayjs; end: Dayjs } | null {
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

    return formatSmartDateRange([value.start, value.end]);
  }

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
        value={null}
        mode="calendar-range"
        disabledDate={filter.disabledDate}
        onRangeSelect={handleDateRangeSelect}
      />
    </>
  );
});
