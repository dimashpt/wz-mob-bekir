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
import {
  ORDER_FILTER_FIELDS,
  ORDER_INTERNAL_STATUS,
  ORDER_PAYMENT_METHODS,
  ORDER_STORE_PLATFORMS,
} from '@/constants/order';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useDebounce } from '@/hooks';
import { queryClient } from '@/lib/react-query';
import { useOrderInfiniteQuery } from '@/services/order/repository';
import {
  Order,
  OrderInternalStatus,
  OrderRequestSearchKey,
  PaymentMethod,
  StorePlatform,
} from '@/services/order/types';
import OrderListItem from './components/order-list-item';

const List = withUniwind(LegendList<Order>);

interface OrderFilters {
  status: OrderInternalStatus[];
  channel: StorePlatform[];
  paymentMethod: PaymentMethod[];
}

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchKey, setSearchKey] =
    useState<OrderRequestSearchKey>('order_code');
  const [search, setSearch, debouncedSearch, isSearchDebouncing] =
    useDebounce();
  const [filters, _setFilters] = useState<OrderFilters>({
    status: [],
    channel: [],
    paymentMethod: [],
  });
  const floatingActionButtonRef = useRef<FloatingActionButton>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useOrderInfiniteQuery(
    {},
    {
      [`search[${searchKey}]`]: debouncedSearch,
      per_page: 10,
      status: filters.status,
      channel: filters.channel,
      payment_method: filters.paymentMethod,
    },
  );

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page?.orders ?? []) ?? [],
    [data],
  );

  function handleRefresh(): void {
    // Set the query data to only contain the first page
    queryClient.setQueryData(
      [ORDER_ENDPOINTS.LIST_ORDERS, 'infinite', { per_page: 10 }],
      {
        pages: [data?.pages[0] ?? []],
        pageParams: [1],
      },
    );

    // Refetch the query to update the UI
    refetch();
  }

  function setFilters(newFilters: Partial<OrderFilters>): void {
    _setFilters((prev) => ({ ...prev, ...newFilters }));
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
        <View className="gap-sm flex-row">
          <FilterGroup
            scrollViewProps={{
              scrollEnabled: false,
            }}
            hideClearAll={true}
            filters={[
              {
                name: 'status',
                label: t('orders.status.title'),
                value: searchKey,
                onChange: (value) =>
                  setSearchKey(value as OrderRequestSearchKey),
                options: Object.entries(ORDER_FILTER_FIELDS).map(
                  ([key, value]) => ({
                    label: value,
                    value: key,
                  }),
                ),
              },
            ]}
          />
          <View className="flex-1">
            <InputField
              placeholder={t('orders.searchPlaceholder')}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              left={<Icon name="search" size="lg" className="text-muted" />}
              className="bg-surface min-h-10 rounded-full"
              loading={isSearchDebouncing || isRefetching}
            />
          </View>
        </View>
        <FilterGroup
          scrollViewProps={{
            contentContainerClassName: 'px-lg',
            className: '-mx-lg',
          }}
          filters={[
            {
              name: 'status',
              label: t('orders.status.title'),
              multiple: true,
              value: filters.status,
              onChange: (value) =>
                setFilters({ status: value as OrderInternalStatus[] }),
              options: Object.values(ORDER_INTERNAL_STATUS).map((value) => ({
                label: value,
                value,
              })),
            },
            {
              name: 'channel',
              label: t('orders.channel'),
              multiple: true,
              value: filters.channel,
              onChange: (value) =>
                setFilters({ channel: value as StorePlatform[] }),
              options: Object.entries(ORDER_STORE_PLATFORMS).map(
                ([, value]) => ({
                  label: value.label,
                  value: value.value,
                }),
              ),
            },
            {
              name: 'payment_method',
              label: t('orders.payment_method'),
              multiple: true,
              value: filters.paymentMethod,
              onChange: (value) =>
                setFilters({ paymentMethod: value as PaymentMethod[] }),
              options: Object.values(ORDER_PAYMENT_METHODS).map((value) => ({
                label: value,
                value,
              })),
            },
          ]}
        />
      </View>
      <List
        data={orders}
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
        onPress={() => {}}
        position={{
          bottom: TAB_BAR_HEIGHT + 20,
          right: 20,
        }}
      />
    </Container>
  );
}
