import { useEffect, useState } from 'react';

type UseDebounceReturn<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  T,
  boolean,
] & {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  debouncedValue: T;
  isDebouncing: boolean;
};

export function useDebounce<T = string>(
  initialValue: T = '' as T,
  delay: number = 500,
): UseDebounceReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    // If value changes, set isDebouncing to true
    if (value !== debouncedValue) {
      setIsDebouncing(true);
    }

    // Set up the debounce timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue]);

  const arrayReturn = [
    value,
    setValue,
    debouncedValue,
    isDebouncing,
  ] as UseDebounceReturn<T>;

  arrayReturn.value = value;
  arrayReturn.setValue = setValue;
  arrayReturn.debouncedValue = debouncedValue;
  arrayReturn.isDebouncing = isDebouncing;

  return arrayReturn;
}
