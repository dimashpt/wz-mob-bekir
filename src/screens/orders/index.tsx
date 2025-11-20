import React, { JSX, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';

import { LegendList } from '@legendapp/list';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import {
  Container,
  FilterGroup,
  FloatingActionButton,
  Icon,
  InputField,
  Text,
} from '@/components';
import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import { ORDER_INTERNAL_STATUS } from '@/constants/order';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { queryClient } from '@/lib/react-query';
import { useOrderInfiniteQuery } from '@/services/order/repository';
import { Order } from '@/services/order/types';
import OrderListItem from './components/order-list-item';

const List = withUniwind(LegendList<Order>);

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const floatingActionButtonRef = useRef<FloatingActionButton>(null);
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

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((order) => {
        const searchableFields = [
          order.order_header_id?.toString(),
          order.store_name,
        ];

        return searchableFields.some(
          (field) => field && field.toString().toLowerCase().includes(query),
        );
      });
    }

    return result;
  }, [orders, searchQuery]);

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
      <View className="gap-sm mb-sm">
        <InputField
          placeholder={t('orders.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          left={<Icon name="search" size="lg" className="text-muted" />}
          className="bg-surface rounded-full"
        />
        <FilterGroup
          scrollViewProps={{
            contentContainerClassName: 'px-lg',
            className: '-mx-lg',
          }}
          filters={[
            {
              name: 'payment_method',
              label: 'Delivery Status',
              multiple: true,
              options: ['COD', 'NON COD', 'DFOD'].map((value) => ({
                label: value,
                value,
              })),
            },
            {
              name: 'channel',
              label: 'Channel',
              multiple: true,
              options: [
                'shopee',
                'lazada',
                'tiktok',
                'tokopedia',
                'shopify',
                'other',
              ].map((value) => ({ label: value, value })),
            },
            {
              name: 'status',
              label: 'Status',
              multiple: true,
              options: Object.values(ORDER_INTERNAL_STATUS).map((value) => ({
                label: value,
                value,
              })),
            },
          ]}
        />
      </View>
      <List
        data={filteredOrders}
        contentContainerClassName="gap-sm"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        onScroll={floatingActionButtonRef.current?.onScroll}
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
      <FloatingActionButton
        ref={floatingActionButtonRef}
        onPress={() => {
          console.log('onPress');
        }}
        position={{
          bottom: TAB_BAR_HEIGHT + 20,
          right: 20,
        }}
      />
    </Container>
  );
}
