import React, { createContext, useContext, useRef, useState } from 'react';
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

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      'Filter child components must be used within Filter component',
    );
  }
  return context;
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

  function registerFilter(
    name: string,
    registration: FilterRegistration,
  ): void {
    filterRegistrations.current[name] = registration;
    // Initialize active state
    setActiveStates((prev) => ({
      ...prev,
      [name]: registration.isActive(),
    }));
  }

  function unregisterFilter(name: string): void {
    delete filterRegistrations.current[name];
    setActiveStates((prev) => {
      const newState = { ...prev };
      delete newState[name];
      return newState;
    });
  }

  function updateActiveState(name: string, isActive: boolean): void {
    setActiveStates((prev) => ({
      ...prev,
      [name]: isActive,
    }));
  }

  function clearAll(): void {
    Object.values(filterRegistrations.current).forEach((registration) => {
      registration.clear();
    });
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }

  function hasActiveFilters(): boolean {
    return Object.values(activeStates).some((isActive) => isActive);
  }

  return (
    <FilterContext.Provider
      value={{
        registerFilter,
        unregisterFilter,
        updateActiveState,
        clearAll,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
