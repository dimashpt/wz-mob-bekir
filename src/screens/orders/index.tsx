import React, { JSX } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useOrderQuery } from '@/services/order/repository';
import OrderListItem from './components/order-list-item';

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { data: orders } = useOrderQuery();

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <Text variant="headingL" className="mb-lg">
        {t('orders.title')}
      </Text>
      <FlatList
        data={orders?.orders}
        contentContainerClassName="gap-sm"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.order_header_id.toString()}
        renderItem={({ item }) => <OrderListItem item={item} />}
      />
    </Container>
  );
}
