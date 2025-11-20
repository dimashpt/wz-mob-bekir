import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import {
  Chip,
  ChipVariant,
  Clickable,
  Divider,
  Icon,
  Text,
} from '@/components';
import { Order, OrderInternalStatus } from '@/services/order/types';
import { formatDisplayDate } from '@/utils/date';

export default function OrderListItem({ item }: { item: Order }): JSX.Element {
  const { t } = useTranslation();

  const statusToTranslationKey = (status: OrderInternalStatus): string => {
    return status
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const statusConfig: Record<OrderInternalStatus, { variant: ChipVariant }> = {
    // Draft
    Unpaid: { variant: 'gray' },
    Draft: { variant: 'gray' },

    // Fulfillment
    'To Process': { variant: 'blue' },
    'In Process': { variant: 'blue' },
    'Ready To Print': { variant: 'blue' },
    Packed: { variant: 'blue' },

    // Shipping
    'Ready For Pickup': { variant: 'blue' },
    'Shipped Order': { variant: 'blue' },
    'Shipping Completed Order': { variant: 'green' },

    // Completed
    'Completed Order': { variant: 'green' },
    'In Return': { variant: 'red' },
    'Return Order': { variant: 'red' },

    // Problems
    'Out Of Stock': { variant: 'red' },
    'Unmapping Product': { variant: 'red' },
    'Unmapping Location': { variant: 'red' },
    'Unmapping Delivery': { variant: 'red' },
    'Undefined Status': { variant: 'red' },

    // Cancelation
    'In Cancel': { variant: 'red' },
    'Cancelled Order': { variant: 'red' },
  };

  return (
    <Clickable
      className="bg-surface border-border p-md gap-xs rounded-md border"
      onPress={() => {}}
    >
      <View className="flex-row items-end justify-between">
        <View className="gap-xs flex-row items-center">
          <Icon name="store" size="base" className="text-foreground" />
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
        <Text variant="labelS" color="muted">
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
          variant={statusConfig[item.internal_status].variant}
        />
      </View>
    </Clickable>
  );
}
