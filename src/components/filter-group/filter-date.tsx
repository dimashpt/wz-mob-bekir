import React, { useEffect, useRef, useState } from 'react';

import { Dayjs } from 'dayjs';

import {
  DatePickerModal,
  DatePickerModalRef,
} from '@/components/date-time-picker/datepicker-modal';
import { formatSmartDateRange } from '@/utils/date';
import { FilterChip } from './filter-chip';
import { useFilterContext } from './filter-context';

export interface FilterDateProps {
  name: string;
  label: string;
  value?: Dayjs | { start: Dayjs; end: Dayjs } | null;
  onChange?: (value: Dayjs | { start: Dayjs; end: Dayjs } | null) => void;
  disabledDate?: (date: Dayjs) => boolean;
  mode?: 'single' | 'range';
}

export function FilterDate({
  name,
  label,
  value: controlledValue,
  onChange,
  disabledDate,
  mode = 'single',
}: FilterDateProps): React.ReactNode {
  const [internalValue, setInternalValue] = useState<
    Dayjs | { start: Dayjs; end: Dayjs } | null
  >(null);
  const datePickerRef = useRef<DatePickerModalRef>(null);
  const context = useFilterContext();

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isActive = Boolean(value);
  const registrationRef = useRef<{
    clear: () => void;
    isActive: () => boolean;
  }>(null);

  const updateActiveState = context?.updateActiveState;

  useEffect(() => {
    updateActiveState?.(name, isActive);
  }, [name, isActive, updateActiveState]);

  function clear(): void {
    const newValue = null;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    updateActiveState?.(name, false);
  }

  function isActiveValue(): boolean {
    return isActive;
  }

  // Update the ref with latest functions on every render
  registrationRef.current = {
    clear,
    isActive: isActiveValue,
  };

  const registerFilter = context?.registerFilter;
  const unregisterFilter = context?.unregisterFilter;

  useEffect(() => {
    if (!registerFilter || !unregisterFilter) return;

    registerFilter(name, {
      clear: () => registrationRef.current?.clear(),
      isActive: () => registrationRef.current?.isActive() ?? false,
    });

    return () => {
      unregisterFilter(name);
    };
  }, [name, registerFilter, unregisterFilter]);

  function handlePress(): void {
    datePickerRef.current?.present();
  }

  function handleDateSelect(date: Dayjs | null): void {
    if (!isControlled) {
      setInternalValue(date);
    }
    onChange?.(date);
    updateActiveState?.(name, Boolean(date));
  }

  function handleDateRangeSelect(range: { start: Dayjs; end: Dayjs }): void {
    if (!isControlled) {
      setInternalValue(range);
    }
    onChange?.(range);
    updateActiveState?.(name, true);
  }

  function getDisplayLabel(): string {
    if (!value) return label;

    if (mode === 'range') {
      const rangeValue = value as { start: Dayjs; end: Dayjs };
      return formatSmartDateRange([rangeValue.start, rangeValue.end]);
    } else {
      const singleValue = value as Dayjs;
      return singleValue.format('DD MMM YYYY');
    }
  }

  return (
    <>
      <FilterChip
        label={getDisplayLabel()}
        isActive={isActive}
        onPress={handlePress}
        showChevron={true}
      />

      {mode === 'range' ? (
        <DatePickerModal
          ref={datePickerRef}
          title={label}
          value={null}
          mode="calendar-range"
          disabledDate={disabledDate}
          onRangeSelect={handleDateRangeSelect}
        />
      ) : (
        <DatePickerModal
          ref={datePickerRef}
          title={label}
          value={value as Dayjs | null}
          mode="calendar"
          disabledDate={disabledDate}
          onSelect={handleDateSelect}
        />
      )}
    </>
  );
}
