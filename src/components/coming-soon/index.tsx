import React, { FC } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

type Props = {
  title?: string;
  subtitle?: string;
};

export const ComingSoon: FC<Props> = ({
  title = 'Coming Soon',
  subtitle = 'This feature is under development. Stay tuned!',
}) => {
  return (
    <View className="gap-lg px-lg flex-1 items-center justify-center">
      <Icon name="rocket" size={64} className="text-foreground" />
      <View className="gap-sm items-center">
        <Text variant="headingS" className="text-center">
          {title}
        </Text>
        <Text variant="bodyM" color="muted" className="text-center">
          {subtitle}
        </Text>
      </View>
    </View>
  );
};
