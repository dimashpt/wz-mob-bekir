import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Text } from '../text';

export function Avatar({
  name,
  className,
  textClassName,
}: {
  name: string;
  className?: string;
  textClassName?: string;
}): React.JSX.Element {
  return (
    <View
      className={twMerge(
        'bg-background size-10 items-center justify-center rounded-full',
        className,
      )}
    >
      <Text
        variant="labelXS"
        className={twMerge('text-[0.5rem] leading-0', textClassName)}
      >
        {name
          .split(' ')
          .map((name) => name[0])
          .join('')}
      </Text>
    </View>
  );
}
