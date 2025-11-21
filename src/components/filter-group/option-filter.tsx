import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components/option-bottom-sheet';
import { FilterChip } from './filter-chip';
import {
  getSelectedOption,
  getSelectedOptions,
} from './helpers/filter-helpers';
import { OptionFilter as OptionFilterType } from './types';

export interface OptionFilterRef {
  clear: () => void;
  getValue: () => string | string[];
  isActive: () => boolean;
}

interface OptionFilterProps {
  filter: OptionFilterType;
  onActiveChange?: (isActive: boolean) => void;
}

/**
 * OptionFilter component that renders a filter chip with option selection via bottom sheet.
 * Manages its own state when uncontrolled, or uses controlled value prop.
 * Supports both single and multiple selection modes.
 */
export const OptionFilter = forwardRef<OptionFilterRef, OptionFilterProps>(
  function OptionFilter({ filter, onActiveChange }, ref): React.ReactNode {
    const [internalValue, setInternalValue] = useState<string | string[]>(
      filter.multiple ? [] : '',
    );
    const optionSheetRef = useRef<OptionBottomSheetRef>(null);

    const isControlled = filter.value !== undefined;
    const value = isControlled ? filter.value : internalValue;
    const isActive = Array.isArray(value) ? value.length > 0 : Boolean(value);

    // Notify parent of initial active state
    useEffect(() => {
      onActiveChange?.(isActive);
    }, [isActive, onActiveChange]);

    function handlePress(): void {
      optionSheetRef.current?.present();
    }

    function handleSelect(selected: Option | Option[]): void {
      let newValue: string | string[];

      if (filter.multiple) {
        newValue = (selected as Option[]).map((opt) => opt.value);
      } else {
        newValue = (selected as Option).value;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      filter.onChange?.(newValue);
      const newIsActive = Array.isArray(newValue)
        ? newValue.length > 0
        : Boolean(newValue);
      onActiveChange?.(newIsActive);
    }

    function clear(): void {
      const defaultValue = filter.multiple ? [] : '';

      if (!isControlled) {
        setInternalValue(defaultValue);
      }

      filter.onChange?.(defaultValue);
      onActiveChange?.(false);
    }

    function getValue(): string | string[] {
      return value ?? (filter.multiple ? [] : '');
    }

    function isActiveValue(): boolean {
      return isActive;
    }

    useImperativeHandle(ref, () => ({
      clear,
      getValue,
      isActive: isActiveValue,
    }));

    function getDisplayLabel(): string {
      if (!value) return filter.label;

      if (filter.multiple) {
        const selectedOptions = getSelectedOptions(filter, value);
        if (selectedOptions.length === 0) return filter.label;
        if (selectedOptions.length === 1) return selectedOptions[0].label;
        return `${filter.label} (${selectedOptions.length})`;
      } else {
        const selectedOption = getSelectedOption(filter, value);
        return selectedOption ? selectedOption.label : filter.label;
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
          title={filter.label}
          options={filter.options}
          {...(filter.multiple
            ? {
                multiselect: true as const,
                selectedValues: getSelectedOptions(filter, value),
                onSelect: (selected: Option[]) => handleSelect(selected),
              }
            : {
                selectedValue: getSelectedOption(filter, value),
                onSelect: (selected: Option) => handleSelect(selected),
              })}
        />
      </>
    );
  },
);
