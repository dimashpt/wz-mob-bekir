import { useCallback, useEffect, useRef, useState } from 'react';

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
  reset: () => void;
};

interface UseDebounceOptions {
  onStartTyping?: () => void;
  onEndTyping?: () => void;
}

export function useDebounce<T = string>(
  initialValue: T = '' as T,
  delay: number = 500,
  options?: UseDebounceOptions,
): UseDebounceReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [hasCalledStart, setHasCalledStart] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If value changes, set isDebouncing to true and call onStartTyping once
    if (value !== debouncedValue) {
      setIsDebouncing(true);
      if (!hasCalledStart && options?.onStartTyping) {
        options.onStartTyping();
        setHasCalledStart(true);
      }
    }

    // Set up the debounce timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
      if (hasCalledStart && options?.onEndTyping) {
        options.onEndTyping();
        setHasCalledStart(false);
      }
    }, delay);

    timeoutRef.current = handler;

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(handler);
      timeoutRef.current = null;
    };
  }, [value, delay, debouncedValue, hasCalledStart, options]);

  const reset = useCallback((): void => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset all values and statuses
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsDebouncing(false);
    setHasCalledStart(false);

    // Fire onEndTyping callback
    if (options?.onEndTyping) {
      options.onEndTyping();
    }
  }, [initialValue, options]);

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
  arrayReturn.reset = reset;

  return arrayReturn;
}
