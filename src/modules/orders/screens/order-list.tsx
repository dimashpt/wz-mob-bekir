import React, { JSX, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { LegendList } from '@legendapp/list';
import { useMutation } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { router } from 'expo-router';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable, withUniwind } from 'uniwind';
import z from 'zod';

import { Illustrations } from '@/assets/illustrations';
import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  Filter,
  FloatingActionButton,
  Icon,
  InputField,
  Skeleton,
  Text,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { screenHeight, screenWidth, useDebounce } from '@/hooks';
import { queryClient } from '@/lib/react-query';
import { stringSchema } from '@/utils/validation';
import OrderListItem from '../components/order-list-item';
import { ORDER_ENDPOINTS } from '../constants/endpoints';
import {
  ORDER_FILTER_FIELDS,
  ORDER_INTERNAL_STATUS,
  ORDER_PAYMENT_TYPES,
} from '../constants/order';
import { getOrders } from '../services/order';
import { useOrderInfiniteQuery } from '../services/order/repository';
import {
  Order,
  OrderInternalStatus,
  OrderRequestSearchKey,
  PaymentMethod,
  StorePlatform,
} from '../services/order/types';

const List = withUniwind(LegendList<Order>);

interface OrderFilters {
  status: OrderInternalStatus[];
  channel: StorePlatform[];
  paymentMethod: PaymentMethod[];
  period: { start: Dayjs; end: Dayjs } | null;
}

const getSearchOrderSchema = z.object({ id: stringSchema });

type SearchOrderFormValues = z.infer<typeof getSearchOrderSchema>;

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const accentColor = useCSSVariable('--color-accent') as string;
  const searchOrderDialogRef = useRef<BottomSheetModal>(null);
  const [searchKey, setSearchKey] =
    useState<OrderRequestSearchKey>('order_code');
  const [search, setSearch, debouncedSearch, isSearchDebouncing] =
    useDebounce();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, _setFilters] = useState<OrderFilters>({
    status: [],
    channel: ['offline', 'website'],
    paymentMethod: [],
    period: null,
  });
  const [isRefreshingManually, setIsRefreshingManually] = useState(false);
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

  const searchOrderMutation = useMutation({
    mutationFn: handleSearchOrder,
    onSuccess: (order) => {
      searchOrderDialogRef.current?.close();
      router.navigate(`/order-details?id=${order.order_header_id.toString()}`);
    },
  });

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page?.orders ?? []) ?? [],
    [data],
  );

  const { control, ...form } = useForm<SearchOrderFormValues>({
    resolver: zodResolver(
      getSearchOrderSchema,
    ) as Resolver<SearchOrderFormValues>,
  });

  /**
   * Handles the search order logic.
   *
   * NOTES: currently, backend doesn not provide an API to exact search by order_code or tracking_number.
   * So we need to search by both fields using order list API and return the matching order.
   *
   *  @param value - The value to search for.
   * @returns The order if found, otherwise throws an error.
   */
  async function handleSearchOrder(value: string): Promise<Order> {
    const params = { page: 1, per_page: 1 };

    // First, try searching by order_code
    const orderCodeResults = await getOrders({
      ...params,
      'search[order_code]': value,
    });

    // Check if we found a matching order by order_code
    const orderByCode = orderCodeResults.orders?.find(
      (order) => order.order_code === value,
    );

    if (orderByCode) return orderByCode;

    // If not found by order_code, try searching by tracking_number
    const trackingNumberResults = await getOrders({
      ...params,
      'search[tracking_number]': value,
    });

    // Check if we found a matching order by tracking_number
    const orderByTracking = trackingNumberResults.orders?.find(
      (order) => order.tracking_number === value,
    );

    if (orderByTracking) return orderByTracking;

    // If neither search found, throw error
    throw new Error(t('orders.order_not_found'));
  }

  async function handleRefresh(): Promise<void> {
    setIsRefreshingManually(true);

    // Set the query data to only contain the first page
    queryClient.setQueryData(
      [ORDER_ENDPOINTS.LIST_ORDERS, 'infinite', { per_page: 10 }],
      {
        pages: [data?.pages[0] ?? []],
        pageParams: [1],
      },
    );

    // Refetch the query to update the UI
    await refetch();
    setIsRefreshingManually(false);
  }

  function setFilters(newFilters: Partial<OrderFilters>): void {
    _setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  function onSearchOrder(data: SearchOrderFormValues): void {
    searchOrderMutation.mutate(data.id);
  }

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <View className="flex-row items-center">
        <Text variant="headingL" className="mb-lg grow">
          {t('orders.title')}
        </Text>
        <Button
          icon="searchFile"
          variant="ghost"
          onPress={searchOrderDialogRef.current?.present}
        />
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
              left={
                <Icon
                  name="search"
                  size="lg"
                  className="text-muted-foreground"
                />
              }
              className="bg-surface rounded-full"
              inputClassName="py-sm"
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
            {/* Channel filter is disabled for now, and showing socialcommerce platforms only */}
            {/* <Filter.Options
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
            /> */}
            <Filter.Options
              name="payment_method"
              label={t('orders.payment_method')}
              multiple={true}
              value={filters.paymentMethod}
              onChange={(value) =>
                setFilters({ paymentMethod: value as PaymentMethod[] })
              }
              options={Object.values(ORDER_PAYMENT_TYPES).map((value) => ({
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
        keyExtractor={(item) => item.order_header_id.toString()}
        className="flex-1"
        contentContainerClassName="gap-sm"
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        scrollEnabled={!isLoading}
        onScroll={floatingActionButtonRef.current?.onScroll}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <OrderListItem item={item} index={index % 10} />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={() => (
          <View className="gap-sm flex-1 items-center justify-center">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-24" />
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
          <RefreshControl
            refreshing={isRefreshingManually}
            onRefresh={handleRefresh}
          />
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
        onPress={() => router.navigate('/order-form')}
        position={{
          bottom: TAB_BAR_HEIGHT + 20,
          right: 20,
        }}
      />
      <BottomSheet.Confirm
        ref={searchOrderDialogRef}
        title="Search Order"
        showCloseButton
        handleSubmit={form.handleSubmit(onSearchOrder)}
        onClose={form.reset}
        closeButtonProps={{ text: t('general.cancel') }}
        submitButtonProps={{
          text: t('orders.search_order'),
          loading: searchOrderMutation.isPending,
        }}
        description={t('orders.search_order_description')}
      >
        <Controller
          control={control}
          name="id"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              bottomSheet
              value={value}
              onChangeText={onChange}
              mandatory
              autoFocus
              errors={error?.message}
              onBlur={onBlur}
              secureTextEntry
              enterKeyHint="done"
              returnKeyType="done"
              placeholder="ORD-ABCDE97531"
              onSubmitEditing={form.handleSubmit(onSearchOrder)}
            />
          )}
        />
      </BottomSheet.Confirm>
    </Container>
  );
}
