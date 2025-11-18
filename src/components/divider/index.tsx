import React, { JSX } from 'react';
import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

export type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps): JSX.Element {
  return <View className={twMerge('bg-border h-px', className)} />;
}
