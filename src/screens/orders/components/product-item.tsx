import type { Product } from '@/services/products/types';

import React from 'react';
import { View } from 'react-native';

import { Image as ExpoImage } from 'expo-image';
import { twMerge } from 'tailwind-merge';
import { withUniwind } from 'uniwind';

import { Clickable, Icon, Text } from '@/components';
import { formatCurrency } from '@/utils/formatter';
import { OrderFormValues } from '../helpers/order-form';

const Image = withUniwind(ExpoImage);

interface ProductItemProps {
  product: OrderFormValues['products'][0];
  selected?: boolean;
  onPress?: (product: Product) => void;
  onQuantityChange?: (updatedProduct: OrderFormValues['products'][0]) => void;
}

export function ProductItem({
  product,
  selected,
  onPress,
  onQuantityChange,
}: ProductItemProps): React.JSX.Element {
  function handleQuantityIncrease(): void {
    if (onQuantityChange) {
      onQuantityChange({
        ...product,
        quantity: (product.quantity ?? 0) + 1,
      });
    }
  }

  function handleQuantityDecrease(): void {
    if (onQuantityChange) {
      onQuantityChange({
        ...product,
        quantity: Math.max((product.quantity ?? 0) - 1, 0),
      });
    }
  }

  return (
    <Clickable
      onPress={onPress ? () => onPress(product) : undefined}
      className={twMerge(
        'gap-sm border-border p-sm pb-sm border-border flex-row items-center rounded-md border',
        selected && 'border-accent bg-accent/10',
      )}
    >
      <Image
        source={{ uri: product?.featured_image_url ?? '' }}
        className="bg-muted size-12 rounded-md"
        contentFit="cover"
      />
      <View className="gap-xs flex-1">
        <View className="gap-sm flex-row justify-between">
          <Text variant="labelS" numberOfLines={1} className="shrink">
            {product?.name}
          </Text>
          <Text variant="labelS">
            {formatCurrency(Number(product?.cost_price ?? 0))}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="gap-xs">
            <Text variant="bodyXS" color="muted">
              SKU: {product?.sku}
            </Text>
            <View className="gap-md flex-row items-center">
              <View className="gap-xs flex-row items-center">
                <Icon
                  name="product"
                  size="sm"
                  className="text-muted-foreground"
                />
                <Text variant="bodyXS" color="muted">
                  {Intl.NumberFormat('id-ID', {
                    style: 'decimal',
                  }).format(product?.available ?? 0)}
                </Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <Icon
                  name="weight"
                  size="sm"
                  className="text-muted-foreground"
                />
                <Text variant="bodyXS" color="muted">
                  {Intl.NumberFormat('id-ID', {
                    style: 'decimal',
                  }).format(Number(product?.weight))}
                  g
                </Text>
              </View>
            </View>
          </View>
          {onQuantityChange && (
            <View className="gap-xs border-accent flex-row items-center rounded-full border">
              <Clickable
                onPress={handleQuantityDecrease}
                disabled={(product.quantity ?? 0) <= 0}
                className="p-xs"
              >
                <Icon name="minus" size="base" className="text-accent" />
              </Clickable>
              <Text variant="labelXS" className="mx-xs">
                {product.quantity ?? 0}
              </Text>
              <Clickable
                onPress={handleQuantityIncrease}
                disabled={(product.quantity ?? 0) >= (product.available ?? 0)}
                className="p-xs"
              >
                <Icon name="plus" size="base" className="text-accent" />
              </Clickable>
            </View>
          )}
        </View>

        {selected && (
          <Icon
            name="tickCircle"
            size="lg"
            className="text-accent absolute right-1 bottom-1"
          />
        )}
      </View>
    </Clickable>
  );
}
