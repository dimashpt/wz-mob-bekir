import React, { useEffect, useRef, useState } from 'react';

import { FilterChip } from './filter-chip';
import { useFilterContext } from './filter-context';

export interface FilterToggleProps {
  name: string;
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function FilterToggle({
  name,
  label,
  value: controlledValue,
  onChange,
}: FilterToggleProps): React.ReactNode {
  const [internalValue, setInternalValue] = useState<boolean>(false);
  const context = useFilterContext();
  const registrationRef = useRef<{
    clear: () => void;
    isActive: () => boolean;
  }>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isActive = Boolean(value);

  const updateActiveState = context?.updateActiveState;

  useEffect(() => {
    updateActiveState?.(name, isActive);
  }, [name, isActive, updateActiveState]);

  function clear(): void {
    const newValue = false;
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
    const newValue = !value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    updateActiveState?.(name, newValue);
  }

  return (
    <FilterChip
      label={label}
      isActive={isActive}
      onPress={handlePress}
      showChevron={false}
    />
  );
}
