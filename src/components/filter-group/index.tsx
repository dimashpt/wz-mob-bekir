import React, { useRef, useState } from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import { twMerge } from 'tailwind-merge';

import {
  DatePickerModal,
  DatePickerModalRef,
} from '@/components/date-time-picker/datepicker-modal';
import { Icon } from '@/components/icon';
import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components/option-bottom-sheet';
import { Text } from '@/components/text';
import { formatSmartDateRange } from '@/utils/date';
import { Clickable } from '../clickable';

interface BaseFilter {
  name: string;
  label: string;
}

interface ToggleFilter extends BaseFilter {
  type?: 'toggle';
  value?: boolean;
  onChange?: (value: boolean) => void;
}

interface OptionFilter extends BaseFilter {
  type: 'options';
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
}

interface DateFilter extends BaseFilter {
  type: 'date';
  value?: Dayjs | null | { start: Dayjs; end: Dayjs };
  onChange?: (value: Dayjs | null | { start: Dayjs; end: Dayjs }) => void;
  mode?: 'calendar' | 'calendar-range' | 'wheel' | 'time';
  disabledDate?: (date: Dayjs) => boolean;
}

export type Filter = ToggleFilter | OptionFilter | DateFilter;

export interface FilterGroupProps {
  filters: Filter[];
  scrollViewProps?: ScrollViewProps;
  hideClearAll?: boolean;
}

export function FilterGroup({
  filters,
  scrollViewProps,
  hideClearAll = false,
}: FilterGroupProps): React.ReactNode {
  // Store internal state for uncontrolled filters
  const [internalStates, setInternalStates] = useState<
    Record<
      string,
      boolean | string | string[] | Dayjs | null | { start: Dayjs; end: Dayjs }
    >
  >({});

  // Refs for option bottom sheets
  const optionSheetRefs = useRef<Record<string, OptionBottomSheetRef | null>>(
    {},
  );

  // Refs for date picker modals
  const datePickerRefs = useRef<Record<string, DatePickerModalRef | null>>({});

  // Ref for scroll view
  const scrollViewRef = useRef<ScrollView>(null);

  function isToggleFilter(filter: Filter): filter is ToggleFilter {
    return filter.type !== 'options' && filter.type !== 'date';
  }

  function isOptionFilter(filter: Filter): filter is OptionFilter {
    return filter.type === 'options';
  }

  function isDateFilter(filter: Filter): filter is DateFilter {
    return filter.type === 'date';
  }

  function isDateRangeFilter(filter: Filter): filter is DateFilter {
    return isDateFilter(filter) && filter.mode === 'calendar-range';
  }

  function getFilterValue(
    filter: Filter,
  ): boolean | string | string[] | Dayjs | null | { start: Dayjs; end: Dayjs } {
    // Use controlled value if provided, otherwise use internal state
    if (filter.value !== undefined) {
      return filter.value;
    }

    const defaultValue = isToggleFilter(filter)
      ? false
      : isDateFilter(filter)
        ? null
        : '';

    return internalStates[filter.name] ?? defaultValue;
  }

  function handleTogglePress(filter: ToggleFilter): void {
    const currentValue = getFilterValue(filter) as boolean;
    const newValue = !currentValue;

    // Update internal state
    setInternalStates((prev) => ({
      ...prev,
      [filter.name]: newValue,
    }));

    // Call onChange callback
    filter?.onChange?.(newValue);
  }

  function handleOptionPress(filter: OptionFilter): void {
    optionSheetRefs.current[filter.name]?.present();
  }

  function handleOptionSelect(
    filter: OptionFilter,
    selected: Option | Option[],
  ): void {
    let newValue: string | string[];

    if (filter.multiple) {
      newValue = (selected as Option[]).map((opt) => opt.value);
    } else {
      newValue = (selected as Option).value;
    }

    // Update internal state
    setInternalStates((prev) => ({
      ...prev,
      [filter.name]: newValue,
    }));

    // Call onChange callback
    filter?.onChange?.(newValue);
  }

  function handleDatePress(filter: DateFilter): void {
    datePickerRefs.current[filter.name]?.present();
  }

  function handleDateSelect(filter: DateFilter, date: Dayjs | null): void {
    // Update internal state
    setInternalStates((prev) => ({
      ...prev,
      [filter.name]: date,
    }));

    // Call onChange callback
    filter?.onChange?.(date);
  }

  function handleDateRangeSelect(
    filter: DateFilter,
    range: { start: Dayjs; end: Dayjs },
  ): void {
    // Update internal state
    setInternalStates((prev) => ({
      ...prev,
      [filter.name]: range,
    }));

    // Call onChange callback
    filter?.onChange?.(range);
  }

  function getSelectedOption(filter: OptionFilter): Option | null {
    const value = getFilterValue(filter);
    if (!value || Array.isArray(value)) return null;
    return filter.options.find((opt) => opt.value === value) || null;
  }

  function getSelectedOptions(filter: OptionFilter): Option[] {
    const value = getFilterValue(filter);
    if (!Array.isArray(value)) return [];
    return filter.options.filter((opt) => value.includes(opt.value));
  }

  function getDisplayLabel(filter: Filter): string {
    if (isToggleFilter(filter)) {
      return filter.label;
    }

    if (isDateFilter(filter)) {
      const value = getFilterValue(filter) as
        | Dayjs
        | null
        | { start: Dayjs; end: Dayjs };

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

    // For option filters, show selected value(s) if any
    const value = getFilterValue(filter);
    if (!value) return filter.label;

    if (filter.multiple) {
      const selectedOptions = getSelectedOptions(filter);
      if (selectedOptions.length === 0) return filter.label;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${filter.label} (${selectedOptions.length})`;
    } else {
      const selectedOption = getSelectedOption(filter);
      return selectedOption ? selectedOption.label : filter.label;
    }
  }

  function handleClearAll(): void {
    const clearedStates: Record<
      string,
      boolean | string | string[] | Dayjs | null | { start: Dayjs; end: Dayjs }
    > = {};

    filters.forEach((filter) => {
      if (isToggleFilter(filter)) {
        clearedStates[filter.name] = false;
        filter?.onChange?.(false);
      } else if (isDateFilter(filter)) {
        clearedStates[filter.name] = null;
        filter?.onChange?.(null);
      } else {
        const optionFilter = filter as OptionFilter;
        const defaultValue = optionFilter.multiple ? [] : '';
        clearedStates[filter.name] = defaultValue;
        filter?.onChange?.(defaultValue);
      }
    });

    setInternalStates(clearedStates);

    // Scroll to start smoothly
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }

  function hasActiveFilters(): boolean {
    return filters.some((filter) => {
      const filterValue = getFilterValue(filter);
      if (isToggleFilter(filter)) {
        return Boolean(filterValue);
      }
      return Array.isArray(filterValue)
        ? filterValue.length > 0
        : !!filterValue;
    });
  }

  return (
    <View className="relative">
      {!hideClearAll && hasActiveFilters() && (
        <Clickable
          onPress={handleClearAll}
          className="p-sm bg-surface border-border absolute top-0 right-0 z-1 self-center rounded-full border"
        >
          <Icon name="close" size="base" className="text-foreground" />
        </Clickable>
      )}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        {...scrollViewProps}
        contentContainerClassName={twMerge(
          scrollViewProps?.contentContainerClassName,
        )}
      >
        <View
          className={twMerge(
            'gap-sm flex-row',
            hideClearAll || !hasActiveFilters() ? '' : 'pr-12',
          )}
        >
          {filters.map((filter) => {
            const isToggle = isToggleFilter(filter);
            const filterValue = getFilterValue(filter);

            // For toggle: active when true
            // For option: active when value is set (single select) or has items (multi-select)
            const isActive = isToggle
              ? Boolean(filterValue)
              : Array.isArray(filterValue)
                ? filterValue.length > 0
                : !!filterValue;

            return (
              <React.Fragment key={filter.name}>
                <Clickable
                  className={twMerge(
                    'gap-xs px-md py-sm flex-row items-center rounded-full border',
                    isActive
                      ? 'bg-accent border-accent'
                      : 'bg-surface border-border',
                  )}
                  onPress={() => {
                    if (isToggle) {
                      handleTogglePress(filter);
                    } else if (isDateFilter(filter)) {
                      handleDatePress(filter);
                    } else {
                      handleOptionPress(filter as OptionFilter);
                    }
                  }}
                >
                  <Text
                    variant="bodyS"
                    className={twMerge(
                      'text-foreground font-medium',
                      isActive
                        ? 'text-foreground-inverted dark:text-foreground-inverted'
                        : 'dark:text-foreground',
                    )}
                  >
                    {getDisplayLabel(filter)}
                  </Text>
                  {!isToggle && (
                    <Icon
                      name="chevron"
                      size="sm"
                      className={twMerge(
                        'text-foreground',
                        isActive
                          ? 'text-foreground-inverted dark:text-foreground-inverted'
                          : 'dark:text-foreground',
                      )}
                    />
                  )}
                </Clickable>

                {isOptionFilter(filter) && (
                  <OptionBottomSheet
                    ref={(ref) => {
                      optionSheetRefs.current[filter.name] = ref;
                    }}
                    title={filter.label}
                    options={filter.options}
                    {...(filter.multiple
                      ? {
                          multiselect: true as const,
                          selectedValues: getSelectedOptions(filter),
                          onSelect: (selected: Option[]) =>
                            handleOptionSelect(filter, selected),
                        }
                      : {
                          selectedValue: getSelectedOption(filter),
                          onSelect: (selected: Option) =>
                            handleOptionSelect(filter, selected),
                        })}
                  />
                )}

                {isDateFilter(filter) && (
                  <DatePickerModal
                    ref={(ref) => {
                      datePickerRefs.current[filter.name] = ref;
                    }}
                    title={filter.label}
                    value={
                      isDateRangeFilter(filter)
                        ? null
                        : (getFilterValue(filter) as Dayjs | null)
                    }
                    mode={filter.mode}
                    disabledDate={filter.disabledDate}
                    {...(isDateRangeFilter(filter)
                      ? {
                          onRangeSelect: (range: {
                            start: Dayjs;
                            end: Dayjs;
                          }) => handleDateRangeSelect(filter, range),
                        }
                      : {
                          onSelect: (date: Dayjs | null) =>
                            handleDateSelect(filter, date),
                        })}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
