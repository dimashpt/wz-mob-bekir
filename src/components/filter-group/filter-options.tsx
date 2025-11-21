import React, { useEffect, useRef, useState } from 'react';

import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components/option-bottom-sheet';
import { FilterChip } from './filter-chip';
import { useFilterContext } from './filter-context';
import {
  getSelectedOption,
  getSelectedOptions,
} from './helpers/filter-helpers';

export interface FilterOptionsProps {
  name: string;
  label: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
}

export function FilterOptions({
  name,
  label,
  value: controlledValue,
  onChange,
  options,
  multiple = false,
}: FilterOptionsProps): React.ReactNode {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    multiple ? [] : '',
  );
  const optionSheetRef = useRef<OptionBottomSheetRef>(null);
  const context = useFilterContext();

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isActive = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const registrationRef = useRef<{
    clear: () => void;
    isActive: () => boolean;
  }>(null);

  const updateActiveState = context?.updateActiveState;

  useEffect(() => {
    updateActiveState?.(name, isActive);
  }, [name, isActive, updateActiveState]);

  function clear(): void {
    const defaultValue = multiple ? [] : '';
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
    onChange?.(defaultValue);
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
    optionSheetRef.current?.present();
  }

  function handleSelect(selected: Option | Option[]): void {
    let newValue: string | string[];
    if (multiple) {
      newValue = (selected as Option[]).map((opt) => opt.value);
    } else {
      newValue = (selected as Option).value;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    const newIsActive = Array.isArray(newValue)
      ? newValue.length > 0
      : Boolean(newValue);
    updateActiveState?.(name, newIsActive);
  }

  function getDisplayLabel(): string {
    if (!value) return label;

    if (multiple) {
      const selectedOptions = getSelectedOptions(options, value);
      if (selectedOptions.length === 0) return label;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${label} (${selectedOptions.length})`;
    } else {
      const selectedOption = getSelectedOption(options, value);
      return selectedOption ? selectedOption.label : label;
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

      <OptionBottomSheet
        ref={optionSheetRef}
        title={label}
        options={options}
        {...(multiple
          ? {
              multiselect: true as const,
              selectedValues: getSelectedOptions(options, value),
              onSelect: (selected: Option[]) => handleSelect(selected),
            }
          : {
              selectedValue: getSelectedOption(options, value),
              onSelect: (selected: Option) => handleSelect(selected),
            })}
      />
    </>
  );
}
