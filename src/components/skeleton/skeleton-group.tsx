import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Skeleton, SkeletonProps } from './skeleton';

export interface SkeletonGroupProps {
  items: SkeletonProps[];
  spacing?: number;
  style?: ViewStyle;
}

export function SkeletonGroup({
  items,
  spacing = 8,
  style,
}: SkeletonGroupProps): React.ReactElement {
  return (
    <View style={style}>
      {items.map((item, index) => (
        <View key={index}>
          <Skeleton {...item} />
          {index < items.length - 1 && <View style={{ height: spacing }} />}
        </View>
      ))}
    </View>
  );
}

export default SkeletonGroup;
