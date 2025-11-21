import React from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Clickable } from '../clickable';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  showChevron?: boolean;
}

/**
 * Shared FilterChip component that renders the common chip UI for all filter types.
 * Handles active/inactive styling, text, and optional chevron icon.
 */
export function FilterChip({
  label,
  isActive,
  onPress,
  showChevron = false,
}: FilterChipProps): React.ReactNode {
  const textClassName = twMerge(
    'text-foreground font-medium',
    isActive
      ? 'text-foreground-inverted dark:text-foreground-inverted'
      : 'dark:text-foreground',
  );

  const iconClassName = twMerge(
    'text-foreground',
    isActive
      ? 'text-foreground-inverted dark:text-foreground-inverted'
      : 'dark:text-foreground',
  );

  return (
    <Clickable
      className={twMerge(
        'gap-xs px-md py-sm flex-row items-center rounded-full border',
        isActive ? 'bg-accent border-accent' : 'bg-surface border-border',
      )}
      onPress={onPress}
    >
      <Text variant="bodyS" className={textClassName}>
        {label}
      </Text>
      {showChevron && (
        <Icon name="chevron" size="sm" className={iconClassName} />
      )}
    </Clickable>
  );
}
