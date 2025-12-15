import type { Product } from '../services/products/types';

import React from 'react';
import { View } from 'react-native';

import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { withUniwind } from 'uniwind';

import { AnimatedComponent, Chip, Clickable, Icon, Text } from '@/components';
import { formatCurrency, formatNumber } from '@/utils/formatter';
import { OrderFormValues } from '../utils/order-form-schema';

const Image = withUniwind(ExpoImage);

interface ProductItemProps {
  product: OrderFormValues['step_item']['products'][0];
  selected?: boolean;
  onPress?: (product: Product) => void;
  onQuantityChange?: (
    updatedProduct: OrderFormValues['step_item']['products'][0],
  ) => void;
  onDeleteRequest?: (
    product: OrderFormValues['step_item']['products'][0],
  ) => void;
  index: number;
}

export function ProductItem({
  product,
  selected,
  onPress,
  onQuantityChange,
  onDeleteRequest,
  index,
}: ProductItemProps): React.JSX.Element {
  const { t } = useTranslation();
  function handleQuantityIncrease(): void {
    if (onQuantityChange) {
      onQuantityChange({
        ...product,
        quantity: (product.quantity ?? 0) + 1,
      });
    }
  }

  function handleQuantityDecrease(): void {
    const currentQuantity = product.quantity ?? 0;
    const newQuantity = Math.max(currentQuantity - 1, 0);

    if (newQuantity === 0 && onDeleteRequest) {
      onDeleteRequest(product);
      return;
    }

    if (onQuantityChange) {
      onQuantityChange({
        ...product,
        quantity: newQuantity,
      });
    }
  }

  function handleDeleteProduct(): void {
    if (!onDeleteRequest) return;
    onDeleteRequest(product);
  }

  return (
    <AnimatedComponent index={index}>
      <Clickable
        onPress={onPress ? () => onPress(product) : undefined}
        disabled={!product.available}
      >
        <View
          className={twMerge(
            'gap-sm border-border p-sm pb-sm flex-row items-center rounded-md border',
            selected && 'border-accent bg-accent/10',
            !product.available && 'opacity-50',
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
                {formatCurrency(Number(product?.published_price ?? 0))}
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
                      {formatNumber(product?.available ?? 0)}
                    </Text>
                  </View>
                  <View className="gap-xs flex-row items-center">
                    <Icon
                      name="weight"
                      size="sm"
                      className="text-muted-foreground"
                    />
                    <Text variant="bodyXS" color="muted">
                      {formatNumber(product?.weight ?? 0)}g
                    </Text>
                  </View>
                </View>
              </View>
              {onQuantityChange && (
                <View className="gap-md flex-row items-center">
                  {onDeleteRequest && (
                    <Clickable onPress={handleDeleteProduct} className="p-xs">
                      <Icon name="trash" size="base" className="text-danger" />
                    </Clickable>
                  )}
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
                      disabled={
                        (product.quantity ?? 0) >= (product.available ?? 0)
                      }
                      className="p-xs"
                    >
                      <Icon name="plus" size="base" className="text-accent" />
                    </Clickable>
                  </View>
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

            {!product.available && (
              <Chip
                label={t('order_form.out_of_stock')}
                variant="red"
                className="absolute right-1 bottom-1"
              />
            )}
          </View>
        </View>
      </Clickable>
    </AnimatedComponent>
  );
}
