import { Dayjs } from 'dayjs';

import { Option } from '@/components/option-bottom-sheet';
import {
  DateFilter,
  DateRangeFilter,
  Filter,
  OptionFilter,
  ToggleFilter,
} from '../types';

export function isToggleFilter(filter: Filter): filter is ToggleFilter {
  return (
    filter.type !== 'options' &&
    filter.type !== 'date' &&
    filter.type !== 'date-range'
  );
}

export function isOptionFilter(filter: Filter): filter is OptionFilter {
  return filter.type === 'options';
}

export function isDateFilter(filter: Filter): filter is DateFilter {
  return filter.type === 'date';
}

export function isDateRangeFilter(filter: Filter): filter is DateRangeFilter {
  return filter.type === 'date-range';
}

export function getFilterValue(
  filter: Filter,
  internalStates: Record<
    string,
    boolean | string | string[] | Dayjs | null | { start: Dayjs; end: Dayjs }
  >,
): boolean | string | string[] | Dayjs | null | { start: Dayjs; end: Dayjs } {
  // Use controlled value if provided, otherwise use internal state
  if (filter.value !== undefined) {
    return filter.value;
  }

  const defaultValue = isToggleFilter(filter)
    ? false
    : isDateFilter(filter) || isDateRangeFilter(filter)
      ? null
      : '';

  return internalStates[filter.name] ?? defaultValue;
}

export function getSelectedOption(
  filter: OptionFilter,
  value: string | string[] | undefined,
): Option | null {
  if (!value || Array.isArray(value)) return null;
  return filter.options.find((opt) => opt.value === value) || null;
}

export function getSelectedOptions(
  filter: OptionFilter,
  value: string | string[] | undefined,
): Option[] {
  if (!Array.isArray(value)) return [];
  return filter.options.filter((opt) => value.includes(opt.value));
}
