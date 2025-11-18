import React, { createContext, useContext, useRef, useState } from 'react';

import { logger } from '@/utils/logger';
import Snackbar, { EXIT_DURATION, SnackbarType } from './snackbar';

interface SnackbarItem {
  id: string;
  visible: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
  isExiting?: boolean;
  isDisplayed?: boolean; // Track if snackbar should be displayed (for 3 most recent)
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type: SnackbarType,
    duration?: number,
  ) => void;
  hideSnackbar: (id?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

// Global snackbar instance for direct usage
let globalSnackbarInstance: SnackbarContextType | null = null;

export function SnackbarProvider({
  children,
}: SnackbarProviderProps): React.JSX.Element {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const nextIdRef = useRef(0);
  const maxVisible = 3;

  function showSnackbar(
    message: string,
    type: SnackbarType,
    duration = 5000,
  ): void {
    setSnackbars((prev) => {
      // Check for duplicate against the most recent visible message only
      // This allows messages to reappear after different messages have been shown
      const visibleSnackbars = prev.filter(
        (snackbar) => snackbar.visible && !snackbar.isExiting,
      );

      // Get the most recent visible snackbar
      const mostRecentSnackbar =
        visibleSnackbars.length > 0
          ? visibleSnackbars[visibleSnackbars.length - 1]
          : null;

      // Only prevent duplicate if it's exactly the same as the most recent message
      const isDuplicateOfMostRecent =
        mostRecentSnackbar &&
        mostRecentSnackbar.message === message &&
        mostRecentSnackbar.type === type;

      // If duplicate of most recent found, don't add new snackbar
      if (isDuplicateOfMostRecent) {
        return prev;
      }

      const id = `snackbar-${nextIdRef.current++}`;
      const newSnackbar: SnackbarItem = {
        id,
        visible: true,
        message,
        type,
        duration,
        isDisplayed: true, // New snackbars are displayed by default
      };

      const updated = [...prev, newSnackbar];

      // Mark older snackbars as not displayed if we exceed maxVisible
      // Keep all snackbars in memory but only display the 3 most recent
      const updatedWithDisplay = updated.map((snackbar, index) => {
        const isInDisplayRange = index >= updated.length - maxVisible;
        return {
          ...snackbar,
          isDisplayed: isInDisplayRange && !snackbar.isExiting,
        };
      });

      return updatedWithDisplay;
    });
  }

  function hideSnackbar(id?: string): void {
    if (id) {
      // Mark specific snackbar as exiting
      setSnackbars((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isExiting: true, visible: false } : item,
        ),
      );
      // Remove after animation completes and update display logic for remaining snackbars
      setTimeout(() => {
        setSnackbars((prev) => {
          const filtered = prev.filter((item) => item.id !== id);

          // Update display logic for remaining snackbars
          const updatedWithDisplay = filtered.map((snackbar, index) => {
            const isInDisplayRange = index >= filtered.length - maxVisible;
            return {
              ...snackbar,
              isDisplayed: isInDisplayRange && !snackbar.isExiting,
            };
          });

          return updatedWithDisplay;
        });
      }, EXIT_DURATION);
    } else {
      // Hide the most recent displayed snackbar (for backward compatibility)
      setSnackbars((prev) => {
        if (prev.length === 0) return prev;

        // Find the most recent displayed snackbar
        const displayedSnackbars = prev.filter(
          (s) => s.isDisplayed && !s.isExiting,
        );
        if (displayedSnackbars.length === 0) return prev;

        const lastDisplayedId =
          displayedSnackbars[displayedSnackbars.length - 1].id;
        const updated = prev.map((item) =>
          item.id === lastDisplayedId
            ? { ...item, isExiting: true, visible: false }
            : item,
        );

        // Remove after animation completes and update display logic
        setTimeout(() => {
          setSnackbars((current) => {
            const filtered = current.filter(
              (item) => item.id !== lastDisplayedId,
            );

            // Update display logic for remaining snackbars
            const updatedWithDisplay = filtered.map((snackbar, index) => {
              const isInDisplayRange = index >= filtered.length - maxVisible;
              return {
                ...snackbar,
                isDisplayed: isInDisplayRange && !snackbar.isExiting,
              };
            });

            return updatedWithDisplay;
          });
        }, EXIT_DURATION);

        return updated;
      });
    }
  }

  const snackbarInstance: SnackbarContextType = {
    showSnackbar,
    hideSnackbar,
  };

  // Update global instance
  globalSnackbarInstance = snackbarInstance;

  return (
    <SnackbarContext.Provider value={snackbarInstance}>
      {children}
      {snackbars
        .filter((snackbar) => snackbar.isDisplayed) // Only render displayed snackbars
        .map((snackbar, index, displayedArray) => {
          // Calculate stack position based on displayed snackbars only
          const visibleDisplayedSnackbars = displayedArray.filter(
            (s) => !s.isExiting,
          );
          const visibleIndex = visibleDisplayedSnackbars.findIndex(
            (s) => s.id === snackbar.id,
          );
          const isTopmost =
            visibleIndex === visibleDisplayedSnackbars.length - 1;
          const stackIndex =
            visibleDisplayedSnackbars.length - 1 - visibleIndex;

          return (
            <Snackbar
              key={snackbar.id}
              visible={snackbar.visible}
              message={snackbar.message}
              type={snackbar.type}
              duration={snackbar.duration}
              onDismiss={() => hideSnackbar(snackbar.id)}
              isStacked={!isTopmost && !snackbar.isExiting}
              stackIndex={snackbar.isExiting ? 0 : stackIndex}
            />
          );
        })}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

// Direct snackbar instance for import and chaining
export const snackbar = {
  success: (message: string, duration?: number): void => {
    if (!globalSnackbarInstance) {
      logger.warn(
        'Snackbar not initialized. Make sure SnackbarProvider is mounted.',
      );
      return;
    }
    globalSnackbarInstance.showSnackbar(message, 'success', duration);
  },
  error: (message: string, duration?: number): void => {
    if (!globalSnackbarInstance) {
      logger.warn(
        'Snackbar not initialized. Make sure SnackbarProvider is mounted.',
      );
      return;
    }
    globalSnackbarInstance.showSnackbar(message, 'error', duration);
  },
  info: (message: string, duration?: number): void => {
    if (!globalSnackbarInstance) {
      logger.warn(
        'Snackbar not initialized. Make sure SnackbarProvider is mounted.',
      );
      return;
    }
    globalSnackbarInstance.showSnackbar(message, 'info', duration);
  },
  hide: (): void => {
    if (!globalSnackbarInstance) {
      logger.warn(
        'Snackbar not initialized. Make sure SnackbarProvider is mounted.',
      );
      return;
    }
    globalSnackbarInstance.hideSnackbar();
  },
};
