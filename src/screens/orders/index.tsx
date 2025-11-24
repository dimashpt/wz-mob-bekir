import React, { JSX, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';

import { LegendList } from '@legendapp/list';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Illustrations } from '@/assets/illustrations';
import {
  Button,
  Container,
  Filter,
  FloatingActionButton,
  Icon,
  InputField,
  Skeleton,
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
import { screenHeight, screenWidth, useDebounce } from '@/hooks';
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
  period: { start: Dayjs; end: Dayjs } | null;
}

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const accentColor = useCSSVariable('--color-accent') as string;

  const [searchKey, setSearchKey] =
    useState<OrderRequestSearchKey>('order_code');
  const [search, setSearch, debouncedSearch, isSearchDebouncing] =
    useDebounce();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, _setFilters] = useState<OrderFilters>({
    status: [],
    channel: [],
    paymentMethod: [],
    period: null,
  });
  const floatingActionButtonRef = useRef<FloatingActionButton>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    refetch,
  } = useOrderInfiniteQuery(
    {},
    {
      [`search[${searchKey}]`]: debouncedSearch,
      per_page: 10,
      status: filters.status,
      channel: filters.channel,
      payment_method: filters.paymentMethod,
      start_date: filters.period?.start?.format('YYYY-MM-DD'),
      end_date: filters.period?.end?.format('YYYY-MM-DD'),
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
      <View className="flex-row items-center justify-between">
        <Text variant="headingL" className="mb-lg">
          {t('orders.title')}
        </Text>
        <Button
          icon={showFilters ? 'close' : 'filter'}
          variant="ghost"
          onPress={() => setShowFilters(!showFilters)}
        />
      </View>
      <View className="gap-sm mb-sm">
        <View className="gap-sm flex-row">
          <Filter.Options
            name="searchKey"
            label={t('orders.status.title')}
            value={searchKey}
            onChange={(value) => setSearchKey(value as OrderRequestSearchKey)}
            options={Object.entries(ORDER_FILTER_FIELDS).map(
              ([key, value]) => ({
                label: t(value),
                value: key,
              }),
            )}
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
        {showFilters && (
          <Filter
            scrollViewProps={{
              contentContainerClassName: 'px-lg',
              className: '-mx-lg',
            }}
          >
            <Filter.Options
              name="status"
              label={t('orders.status.title')}
              multiple={true}
              value={filters.status}
              onChange={(value) =>
                setFilters({ status: value as OrderInternalStatus[] })
              }
              options={Object.entries(ORDER_INTERNAL_STATUS).map(
                ([key, value]) => ({
                  label: t(value),
                  value: key,
                }),
              )}
            />
            <Filter.Options
              name="channel"
              label={t('orders.channel')}
              multiple={true}
              value={filters.channel}
              onChange={(value) =>
                setFilters({ channel: value as StorePlatform[] })
              }
              options={Object.entries(ORDER_STORE_PLATFORMS).map(
                ([, value]) => ({
                  label: value.label,
                  value: value.value,
                }),
              )}
            />
            <Filter.Options
              name="payment_method"
              label={t('orders.payment_method')}
              multiple={true}
              value={filters.paymentMethod}
              onChange={(value) =>
                setFilters({ paymentMethod: value as PaymentMethod[] })
              }
              options={Object.values(ORDER_PAYMENT_METHODS).map((value) => ({
                label: value,
                value,
              }))}
            />
            <Filter.Date
              name="period"
              label={t('orders.period')}
              mode="range"
              value={filters.period}
              onChange={(value) =>
                setFilters({
                  period: value as { start: Dayjs; end: Dayjs } | null,
                })
              }
              disabledDate={(date) => date.isAfter(dayjs())}
            />
          </Filter>
        )}
      </View>
      <List
        data={orders}
        contentContainerClassName="gap-sm flex-1"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        scrollEnabled={!isLoading}
        onScroll={floatingActionButtonRef.current?.onScroll}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.order_header_id.toString()}
        renderItem={({ item }) => <OrderListItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={() => (
          <View className="gap-sm flex-1 items-center justify-center">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={100} />
              ))
            ) : (
              <>
                {debouncedSearch ? (
                  <Illustrations.SearchNotFound
                    color={accentColor}
                    width={screenWidth / 3}
                    height={screenHeight / 3}
                  />
                ) : (
                  <Illustrations.NoData
                    color={accentColor}
                    width={screenWidth / 3}
                    height={screenHeight / 3}
                  />
                )}
                <Text variant="bodyM" className="text-center">
                  {debouncedSearch
                    ? t('general.no_data_found', { search: debouncedSearch })
                    : t('general.no_data_description')}
                </Text>
              </>
            )}
          </View>
        )}
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
