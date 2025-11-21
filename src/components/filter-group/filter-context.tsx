import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollView } from 'react-native';

export interface FilterRegistration {
  clear: () => void;
  isActive: () => boolean;
}

interface FilterContextValue {
  registerFilter: (name: string, registration: FilterRegistration) => void;
  unregisterFilter: (name: string) => void;
  updateActiveState: (name: string, isActive: boolean) => void;
  clearAll: () => void;
  hasActiveFilters: () => boolean;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function useFilterContext(): FilterContextValue | null {
  return useContext(FilterContext);
}

export function FilterProvider({
  children,
  scrollViewRef,
}: {
  children: React.ReactNode;
  scrollViewRef: React.RefObject<ScrollView | null>;
}): React.ReactNode {
  const filterRegistrations = useRef<Record<string, FilterRegistration>>({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  const registerFilter = useCallback(
    (name: string, registration: FilterRegistration): void => {
      filterRegistrations.current[name] = registration;
      // Initialize active state
      setActiveStates((prev) => ({
        ...prev,
        [name]: registration.isActive(),
      }));
    },
    [],
  );

  const unregisterFilter = useCallback((name: string): void => {
    delete filterRegistrations.current[name];
    setActiveStates((prev) => {
      const newState = { ...prev };
      delete newState[name];
      return newState;
    });
  }, []);

  const updateActiveState = useCallback(
    (name: string, isActive: boolean): void => {
      setActiveStates((prev) => {
        // Only update if the value actually changed
        if (prev[name] === isActive) return prev;
        return {
          ...prev,
          [name]: isActive,
        };
      });
    },
    [],
  );

  const clearAll = useCallback((): void => {
    Object.values(filterRegistrations.current).forEach((registration) => {
      registration.clear();
    });
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }, [scrollViewRef]);

  const hasActiveFilters = useCallback((): boolean => {
    return Object.values(activeStates).some((isActive) => isActive);
  }, [activeStates]);

  const contextValue = useMemo<FilterContextValue>(
    () => ({
      registerFilter,
      unregisterFilter,
      updateActiveState,
      clearAll,
      hasActiveFilters,
    }),
    [
      registerFilter,
      unregisterFilter,
      updateActiveState,
      clearAll,
      hasActiveFilters,
    ],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}
