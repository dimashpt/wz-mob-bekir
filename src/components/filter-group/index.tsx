import React, { useRef, useState } from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components/option-bottom-sheet';
import { Text } from '@/components/text';
import { Clickable } from '../clickable';

interface BaseFilter {
  name: string;
  label: string;
}

interface ToggleFilter extends BaseFilter {
  value?: boolean;
  onChange?: (value: boolean) => void;
  options?: never;
  multiple?: never;
}

interface OptionFilter extends BaseFilter {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
}

export type Filter = ToggleFilter | OptionFilter;

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
    Record<string, boolean | string | string[]>
  >({});
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  // Refs for option bottom sheets
  const optionSheetRefs = useRef<Record<string, OptionBottomSheetRef | null>>(
    {},
  );

  // Ref for scroll view
  const scrollViewRef = useRef<ScrollView>(null);

  function isToggleFilter(filter: Filter): filter is ToggleFilter {
    return !filter.options;
  }

  function getFilterValue(filter: Filter): boolean | string | string[] {
    // Use controlled value if provided, otherwise use internal state
    if (filter.value !== undefined) {
      return filter.value;
    }
    return internalStates[filter.name] ?? (isToggleFilter(filter) ? false : '');
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
    const clearedStates: Record<string, boolean | string | string[]> = {};

    filters.forEach((filter) => {
      if (isToggleFilter(filter)) {
        clearedStates[filter.name] = false;
        filter?.onChange?.(false);
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
        style={[{ width: scrollViewWidth }, scrollViewProps?.style]}
        contentContainerClassName={twMerge(
          scrollViewProps?.contentContainerClassName,
        )}
      >
        <View
          className={twMerge('gap-sm flex-row', hideClearAll ? '' : 'pr-14')}
          onLayout={({ nativeEvent }) => {
            setScrollViewWidth(nativeEvent.layout.width);
          }}
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

                {!isToggle && (
                  <OptionBottomSheet
                    ref={(ref) => {
                      optionSheetRefs.current[filter.name] = ref;
                    }}
                    title={filter.label}
                    options={(filter as OptionFilter).options}
                    {...((filter as OptionFilter).multiple
                      ? {
                          multiselect: true as const,
                          selectedValues: getSelectedOptions(
                            filter as OptionFilter,
                          ),
                          onSelect: (selected: Option[]) =>
                            handleOptionSelect(
                              filter as OptionFilter,
                              selected,
                            ),
                        }
                      : {
                          selectedValue: getSelectedOption(
                            filter as OptionFilter,
                          ),
                          onSelect: (selected: Option) =>
                            handleOptionSelect(
                              filter as OptionFilter,
                              selected,
                            ),
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
