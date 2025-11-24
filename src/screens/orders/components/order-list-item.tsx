import React, { JSX } from 'react';
import { View } from 'react-native';

import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { Chip, Clickable, Divider, Icon, Text } from '@/components';
import {
  ORDER_STATUS_CHIP_VARIANTS,
  ORDER_STORE_PLATFORMS_LOGOS,
} from '@/constants/order';
import { Order } from '@/services/order/types';
import { formatDisplayDate } from '@/utils/date';
import { statusToTranslationKey } from '../helpers/order-helpers';

const Image = withUniwind(ExpoImage);

export default function OrderListItem({ item }: { item: Order }): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Clickable
      className="bg-surface border-border p-md gap-xs rounded-md border"
      onPress={() => {
        router.navigate(`/order-details?id=${item.order_header_id}`);
      }}
    >
      <View className="flex-row items-end justify-between">
        <View className="gap-xs flex-row items-center">
          {ORDER_STORE_PLATFORMS_LOGOS[item.store_platform] ? (
            <Image
              source={ORDER_STORE_PLATFORMS_LOGOS[item.store_platform]}
              className="size-6"
              contentFit="contain"
            />
          ) : (
            <Icon name="store" size="base" className="text-foreground" />
          )}
          <Text variant="labelM">{item.store_name}</Text>
        </View>
        <Text variant="labelL" className="font-extrabold">
          {Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(Number(item.grand_total_order_price))}
        </Text>
      </View>
      <View className="flex-row items-start justify-between">
        <Text variant="labelXS" color="muted">
          {item.order_code}
        </Text>
        <View className="gap-xs flex-row items-center">
          <Icon name="product" size="sm" className="text-muted" />
          <Text variant="bodyXS" color="muted">
            {t('orders.total_items', {
              count: item.order_items.length,
            })}
          </Text>
        </View>
      </View>
      <Divider className="my-xs -mx-md" />
      <View className="flex-row items-center justify-between">
        <Text variant="bodyXS" color="muted">
          {formatDisplayDate(item.created_at, false)}
        </Text>
        <Chip
          label={t(
            `orders.status.${statusToTranslationKey(item.internal_status)}`,
          )}
          variant={ORDER_STATUS_CHIP_VARIANTS[item.internal_status].variant}
        />
      </View>
    </Clickable>
  );
}
