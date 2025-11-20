import React, { JSX, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';

import { LegendList } from '@legendapp/list';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { Container, Text } from '@/components';
import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { queryClient } from '@/lib/react-query';
import { useOrderInfiniteQuery } from '@/services/order/repository';
import { Order } from '@/services/order/types';
import OrderListItem from './components/order-list-item';

const List = withUniwind(LegendList<Order>);

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useOrderInfiniteQuery();

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page.orders) ?? [],
    [data],
  );

  function handleRefresh(): void {
    // Set the query data to only contain the first page
    queryClient.setQueryData(
      [ORDER_ENDPOINTS.LIST_ORDERS, 'infinite', { per_page: 10 }],
      {
        pages: [data?.pages[0]],
        pageParams: [1],
      },
    );

    // Refetch the query to update the UI
    refetch();
  }

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
      <List
        data={orders}
        contentContainerClassName="gap-sm"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.order_header_id.toString()}
        renderItem={({ item }) => <OrderListItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-md items-center">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </Container>
  );
}
