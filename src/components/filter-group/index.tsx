import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Clickable } from '../clickable';
import { DateFilter, DateFilterRef } from './date-filter';
import {
  isDateFilter,
  isOptionFilter,
  isToggleFilter,
} from './helpers/filter-helpers';
import { OptionFilter, OptionFilterRef } from './option-filter';
import { ToggleFilter, ToggleFilterRef } from './toggle-filter';
import { FilterGroupProps } from './types';

export type { Filter, FilterGroupProps } from './types';

export function FilterGroup({
  filters,
  scrollViewProps,
  hideClearAll = false,
}: FilterGroupProps): React.ReactNode {
  // Refs for each filter component to enable clear-all functionality
  const filterRefs = useRef<
    Record<string, ToggleFilterRef | OptionFilterRef | DateFilterRef | null>
  >({});

  // Track active state for each filter
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  // Ref for scroll view
  const scrollViewRef = useRef<ScrollView>(null);

  function handleActiveChange(filterName: string, isActive: boolean): void {
    setActiveStates((prev) => ({
      ...prev,
      [filterName]: isActive,
    }));
  }

  function hasActiveFilters(): boolean {
    return Object.values(activeStates).some((isActive) => isActive);
  }

  function handleClearAll(): void {
    filters.forEach((filter) => {
      const filterRef = filterRefs.current[filter.name];
      if (filterRef) {
        filterRef.clear();
      }
    });

    // Scroll to start smoothly
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
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
            if (isToggleFilter(filter)) {
              return (
                <ToggleFilter
                  key={filter.name}
                  ref={(ref) => {
                    filterRefs.current[filter.name] = ref;
                  }}
                  filter={filter}
                  onActiveChange={(isActive) =>
                    handleActiveChange(filter.name, isActive)
                  }
                />
              );
            }

            if (isOptionFilter(filter)) {
              return (
                <OptionFilter
                  key={filter.name}
                  ref={(ref) => {
                    filterRefs.current[filter.name] = ref;
                  }}
                  filter={filter}
                  onActiveChange={(isActive) =>
                    handleActiveChange(filter.name, isActive)
                  }
                />
              );
            }

            if (isDateFilter(filter)) {
              return (
                <DateFilter
                  key={filter.name}
                  ref={(ref) => {
                    filterRefs.current[filter.name] = ref;
                  }}
                  filter={filter}
                  onActiveChange={(isActive) =>
                    handleActiveChange(filter.name, isActive)
                  }
                />
              );
            }

            return null;
          })}
        </View>
      </ScrollView>
    </View>
  );
}
