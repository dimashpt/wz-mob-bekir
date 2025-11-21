import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Clickable } from '../clickable';
import { FilterProvider, useFilterContext } from './filter-context';

export interface FilterRootProps {
  children: React.ReactNode;
  scrollViewProps?: import('react-native').ScrollViewProps;
  hideClearAll?: boolean;
}

function FilterContent({
  children,
  scrollViewProps,
  hideClearAll = false,
  scrollViewRef,
}: {
  children: React.ReactNode;
  scrollViewProps?: import('react-native').ScrollViewProps;
  hideClearAll: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
}): React.ReactNode {
  const { clearAll, hasActiveFilters } = useFilterContext();

  const { children: _, ...restScrollViewProps } = scrollViewProps || {};

  return (
    <View className="relative">
      {!hideClearAll && hasActiveFilters() && (
        <Clickable
          onPress={clearAll}
          className="p-sm bg-surface border-border absolute top-0 right-0 z-1 self-center rounded-full border"
        >
          <Icon name="close" size="base" className="text-foreground" />
        </Clickable>
      )}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        {...restScrollViewProps}
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
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

export function FilterRoot({
  children,
  scrollViewProps,
  hideClearAll = false,
}: FilterRootProps): React.ReactNode {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <FilterProvider scrollViewRef={scrollViewRef}>
      <FilterContent
        scrollViewProps={scrollViewProps}
        hideClearAll={hideClearAll}
        scrollViewRef={scrollViewRef}
      >
        {children}
      </FilterContent>
    </FilterProvider>
  );
}
