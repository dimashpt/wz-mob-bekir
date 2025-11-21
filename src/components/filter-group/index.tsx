import React from 'react';

import { FilterDate } from './filter-date';
import { FilterOptions } from './filter-options';
import { FilterRoot, FilterRootProps } from './filter-root';
import { FilterToggle } from './filter-toggle';

// Export the root component
export function Filter(props: FilterRootProps): React.ReactNode {
  return <FilterRoot {...props} />;
}

// Attach child components as static properties
Filter.Toggle = FilterToggle;
Filter.Options = FilterOptions;
Filter.Date = FilterDate;

// Export types
export type { FilterRootProps as FilterProps } from './filter-root';
export type { FilterToggleProps } from './filter-toggle';
export type { FilterOptionsProps } from './filter-options';
export type { FilterDateProps } from './filter-date';

// Keep backward compatibility exports for now (will be removed after migration)
export type { Filter as FilterLegacy, FilterGroupProps } from './types';
