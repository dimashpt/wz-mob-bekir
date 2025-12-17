import React, { JSX } from 'react';
import { View } from 'react-native';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  AnimatedComponent,
  Chip,
  Clickable,
  Divider,
  Icon,
  Image,
  Text,
} from '@/components';
import { formatDisplayDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatter';
import {
  ORDER_STATUS_CHIP_VARIANTS,
  ORDER_STORE_PLATFORMS_LOGOS,
} from '../constants/order';
import { Order } from '../services/order/types';
import { statusToTranslationKey } from '../utils/order-helpers';

export default function OrderListItem({
  item,
  index,
}: {
  item: Order;
  index: number;
}): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AnimatedComponent index={index}>
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
            {formatCurrency(item.grand_total_order_price)}
          </Text>
        </View>
        <View className="gap-lg flex-row items-start justify-between">
          <Text
            variant="labelXS"
            color="muted"
            className="shrink"
            numberOfLines={1}
          >
            {item.order_code} ABC abc basdkajsd akjs kjdnaisj pkj asp
          </Text>
          <View className="gap-xs flex-row items-center">
            <Icon name="product" size="sm" className="text-muted-foreground" />
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
            {t('orders.created_at', {
              date: formatDisplayDate(item.created_at, false),
            })}
          </Text>
          <Chip
            label={t(
              `orders.status.${statusToTranslationKey(item.internal_status)}`,
            )}
            variant={
              ORDER_STATUS_CHIP_VARIANTS?.[item.internal_status]?.variant
            }
          />
        </View>
      </Clickable>
    </AnimatedComponent>
  );
}
