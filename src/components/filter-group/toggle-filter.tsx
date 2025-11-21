import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { FilterChip } from './filter-chip';
import { ToggleFilter as ToggleFilterType } from './types';

export interface ToggleFilterRef {
  clear: () => void;
  getValue: () => boolean;
}

interface ToggleFilterProps {
  filter: ToggleFilterType;
  onActiveChange?: (isActive: boolean) => void;
}

/**
 * ToggleFilter component that renders a toggleable filter chip.
 * Manages its own state when uncontrolled, or uses controlled value prop.
 */
export const ToggleFilter = forwardRef<ToggleFilterRef, ToggleFilterProps>(
  function ToggleFilter({ filter, onActiveChange }, ref): React.ReactNode {
    const [internalValue, setInternalValue] = useState<boolean>(false);

    const isControlled = filter.value !== undefined;
    const value =
      isControlled && filter.value !== undefined ? filter.value : internalValue;
    const isActive = Boolean(value);

    // Notify parent of initial active state
    useEffect(() => {
      onActiveChange?.(isActive);
    }, [isActive, onActiveChange]);

    function handlePress(): void {
      const newValue = !value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      filter.onChange?.(newValue);
      onActiveChange?.(newValue);
    }

    function clear(): void {
      const newValue = false;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      filter.onChange?.(newValue);
      onActiveChange?.(newValue);
    }

    function getValue(): boolean {
      return value;
    }

    useImperativeHandle(ref, () => ({
      clear,
      getValue,
    }));

    return (
      <FilterChip
        label={filter.label}
        isActive={isActive}
        onPress={handlePress}
        showChevron={false}
      />
    );
  },
);
