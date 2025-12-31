import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Text } from '../text';

export function Avatar({
  name,
  className,
  textClassName,
  children,
}: {
  name: string;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <View
      className={twMerge(
        'bg-background size-10 items-center justify-center rounded-full',
        className,
      )}
    >
      {children ?? (
        <Text
          variant="labelXS"
          className={twMerge('text-[0.5rem] leading-0', textClassName)}
        >
          {name
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase()}
        </Text>
      )}
    </View>
  );
}
