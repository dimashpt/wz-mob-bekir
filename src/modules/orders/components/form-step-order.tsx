import React, { JSX, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import dayjs from 'dayjs';
import { Image as ExpoImage } from 'expo-image';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { withUniwind } from 'uniwind';

import {
  Container,
  Icon,
  InputField,
  SelectDateTime,
  Text,
} from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import {
  ORDER_PAYMENT_TYPES,
  ORDER_PAYMENT_VIA,
  ORDER_STORE_PLATFORMS_LOGOS,
} from '../constants/order';
import { useOrderForm } from '../context/order-form-context';
import { useStoresInfiniteQuery } from '../services/store/repository';
import { useWarehousesInfiniteQuery } from '../services/warehouse/repository';
import { OrderFormValues } from '../utils/order-form-schema';

const Image = withUniwind(ExpoImage);

export function FormStepOrder(): JSX.Element {
  const { t } = useTranslation();
  const {
    data: stores,
    fetchNextPage: fetchNextStorePage,
    hasNextPage: hasNextStorePage,
    isFetchingNextPage: isFetchingNextStorePage,
  } = useStoresInfiniteQuery();
  const {
    data: warehouses,
    fetchNextPage: fetchNextWarehousePage,
    hasNextPage: hasNextWarehousePage,
    isFetchingNextPage: isFetchingNextWarehousePage,
  } = useWarehousesInfiniteQuery();
  const { resetProducts, resetLogistic } = useOrderForm();

  const storeOptions = useMemo(
    () =>
      stores?.pages
        .flatMap((page) => page?.stores ?? [])
        .map((store) => ({
          label: store.alias,
          value: store.store_id.toString(),
          data: store,
        })) ?? [],
    [stores],
  );

  const warehouseOptions = useMemo(
    () =>
      warehouses?.pages
        .flatMap((page) => page?.locations ?? [])
        .map((warehouse) => ({
          label: [warehouse.name, warehouse.city].filter(Boolean).join(' - '),
          value: warehouse.id.toString(),
          data: warehouse,
        })) ?? [],
    [warehouses],
  );

  const { control, ...form } = useFormContext<OrderFormValues>();
  const watchPaymentMethodType = useWatch({
    control,
    name: 'step_order.payment_type',
  });

  const PAYMENT_TYPE_OPTIONS = Object.keys(ORDER_PAYMENT_TYPES).map(
    (method) => ({
      label: method,
      value: method,
    }),
  );

  const PAYMENT_VIA_OPTIONS = (
    ORDER_PAYMENT_VIA[
      watchPaymentMethodType?.value as keyof typeof ORDER_PAYMENT_VIA
    ] ?? []
  ).map((method) => ({ label: method, value: method }));

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.order_information')}</Text>
      <Container.Card className="p-md gap-sm">
        <Controller
          control={control}
          name="step_order.order_code"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.order_code')}
              value={value}
              mandatory
              errors={error?.message}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_order_number')}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.payment_type"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label={t('order_form.payment_type')}
              onSelect={(value) => {
                onChange(value);
                form.resetField('step_order.payment_method', {
                  keepError: true,
                });
              }}
              options={PAYMENT_TYPE_OPTIONS}
              value={value?.value}
              onBlur={onBlur}
              errors={error?.message}
              placeholder={t('order_form.select_payment_method')}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.payment_method"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label={t('order_form.payment_via')}
              onSelect={onChange}
              disabled={!watchPaymentMethodType}
              options={PAYMENT_VIA_OPTIONS}
              value={value?.value}
              onBlur={onBlur}
              errors={error?.message}
              placeholder={t('order_form.select_payment_via')}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.store"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label={t('order_form.store')}
              onSelect={onChange}
              options={storeOptions}
              value={value?.label}
              onBlur={onBlur}
              errors={error?.message}
              flatListProps={{
                onEndReached: () => {
                  if (hasNextStorePage && !isFetchingNextStorePage) {
                    fetchNextStorePage();
                  }
                },
                onEndReachedThreshold: 0.5,
                ListFooterComponent: isFetchingNextStorePage ? (
                  <View className="py-md items-center">
                    <ActivityIndicator size="small" />
                  </View>
                ) : null,
              }}
              placeholder={t('order_form.select_store')}
              renderItem={(props) => (
                <View
                  className={twMerge(
                    'p-md gap-sm w-full flex-row items-center',
                    storeOptions.length !== props.index + 1 &&
                      'border-border border-b',
                  )}
                >
                  {props.item.data?.channel && (
                    <Image
                      source={
                        ORDER_STORE_PLATFORMS_LOGOS[props.item.data?.channel]
                      }
                      className="size-6"
                      contentFit="contain"
                    />
                  )}
                  <Text variant="bodyS" className="flex-1">
                    {props.item.data?.alias}
                  </Text>
                  {props.isSelected && (
                    <Icon name="tickCircle" size="lg" className="text-accent" />
                  )}
                </View>
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.warehouse"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label={t('order_form.warehouse')}
              onSelect={(value) => {
                onChange(value);
                resetProducts();
                resetLogistic();
              }}
              options={warehouseOptions}
              value={value?.label}
              onBlur={onBlur}
              errors={error?.message}
              flatListProps={{
                onEndReached: () => {
                  if (hasNextWarehousePage && !isFetchingNextWarehousePage) {
                    fetchNextWarehousePage();
                  }
                },
                onEndReachedThreshold: 0.5,
                ListFooterComponent: isFetchingNextWarehousePage ? (
                  <View className="py-md items-center">
                    <ActivityIndicator />
                  </View>
                ) : null,
              }}
              placeholder={t('order_form.select_warehouse')}
              helpers={t('order_form.helpers.warehouse_change')}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.checkout_time"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectDateTime
              mandatory
              value={value ? dayjs(value) : undefined}
              onChange={onChange}
              onBlur={onBlur}
              label={t('order_form.checkout_time')}
              placeholder={t('order_form.select_checkout_date')}
              mode="datetime"
              errors={error?.message}
              disabledDate={(date) => date.isAfter(dayjs())}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.sales"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.sales')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={error?.message}
              placeholder={t('order_form.enter_sales_pic')}
            />
          )}
        />
        <Controller
          control={control}
          name="step_order.remarks"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.remarks')}
              value={value}
              multiline
              inputClassName="min-h-20"
              onChangeText={onChange}
              onBlur={onBlur}
              errors={error?.message}
              placeholder={t('order_form.enter_remarks')}
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
