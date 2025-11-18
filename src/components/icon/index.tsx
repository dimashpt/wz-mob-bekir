import React from 'react';

import { SvgProps } from 'react-native-svg';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Icons as SvgIcons } from '@/assets/icons';

export type IconNames = keyof typeof SvgIcons;

export { SvgIcons };

type FontSizes = {
  xxs: number;
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
};

export interface Icon extends SvgProps {
  name: IconNames;
  size?: keyof FontSizes | number;
}

/**
 * Icon component
 * @param name - The name of the icon
 * @param size - The size of the icon
 * @param props - The props of the icon
 * @returns The icon component
 */
export function Icon({ name, size = 'base', ...props }: Icon): React.ReactNode {
  const sizeXxs = useCSSVariable('--text-xxs') as number;
  const sizeXs = useCSSVariable('--text-xs') as number;
  const sizeSm = useCSSVariable('--text-sm') as number;
  const sizeBase = useCSSVariable('--text-base') as number;
  const sizeLg = useCSSVariable('--text-lg') as number;
  const sizeXl = useCSSVariable('--text-xl') as number;
  const size2xl = useCSSVariable('--text-2xl') as number;
  const size3xl = useCSSVariable('--text-3xl') as number;

  const sizeMap: FontSizes = {
    xxs: sizeXxs,
    xs: sizeXs,
    sm: sizeSm,
    base: sizeBase,
    lg: sizeLg,
    xl: sizeXl,
    '2xl': size2xl,
    '3xl': size3xl,
  };

  if (typeof name === 'string' && name in SvgIcons) {
    const IconComponent = withUniwind(SvgIcons[name as keyof typeof SvgIcons]);

    return (
      <IconComponent
        width={typeof size === 'number' ? size : sizeMap[size]}
        height={typeof size === 'number' ? size : sizeMap[size]}
        {...props}
      />
    );
  }

  return null;
}
