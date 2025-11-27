import React, { JSX, useMemo } from 'react';

import dayjs from 'dayjs';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Container, InputField, SelectDateTime, Text } from '@/components';
import SelectInput from '@/components/select-input';
import { ORDER_PAYMENT_TYPES, ORDER_PAYMENT_VIA } from '@/constants/order';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useStoresInfiniteQuery } from '@/services/store/repository';
import { useWarehousesInfiniteQuery } from '@/services/warehouse/repository';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepOrder(): JSX.Element {
  const { data: stores } = useStoresInfiniteQuery();
  const { data: warehouses } = useWarehousesInfiniteQuery();

  const storeOptions = useMemo(
    () =>
      stores?.pages
        .flatMap((page) => page?.stores ?? [])
        .map((store) => ({
          label: store.alias,
          value: store.store_id.toString(),
        })) ?? [],
    [stores],
  );

  const warehouseOptions = useMemo(
    () =>
      warehouses?.pages
        .flatMap((page) => page?.locations ?? [])
        .map((warehouse) => ({
          label: warehouse.name,
          value: warehouse.id.toString(),
        })) ?? [],
    [warehouses],
  );

  const { control, ...form } = useFormContext<OrderFormValues>();
  const watchPaymentMethodType = useWatch({
    control,
    name: 'payment_method_type',
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
      <Text variant="labelL">Order Information</Text>
      <Container.Card className="p-md gap-sm">
        <Controller
          control={control}
          name="order_code"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="No. Order"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan nomor order"
            />
          )}
        />
        <Controller
          control={control}
          name="payment_method_type"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label="Payment Method"
              onSelect={(value) => {
                onChange(value);
                form.setValue('payment_via', null);
              }}
              options={PAYMENT_TYPE_OPTIONS}
              value={value?.value}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih metode pembayaran"
            />
          )}
        />
        <Controller
          control={control}
          name="payment_via"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label="Payment Via"
              onSelect={onChange}
              disabled={!watchPaymentMethodType}
              options={PAYMENT_VIA_OPTIONS}
              value={value?.value}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih cara pembayaran"
            />
          )}
        />
        <Controller
          control={control}
          name="store_id"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label="Toko"
              onSelect={onChange}
              options={storeOptions}
              value={value.label}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih toko"
            />
          )}
        />
        <Controller
          control={control}
          name="location_id"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              mandatory
              label="Dikirim dari"
              onSelect={onChange}
              options={warehouseOptions}
              value={value.label}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih lokasi pengiriman"
            />
          )}
        />
        <Controller
          control={control}
          name="checkout_at"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectDateTime
              mandatory
              value={value ? dayjs(value) : undefined}
              onSelect={onChange}
              onBlur={onBlur}
              label="Tanggal Checkout"
              placeholder="Pilih tanggal checkout"
              mode="calendar"
              error={!!error?.message}
              errors={error?.message ? [error.message] : []}
              disabledDate={(date) => date.isAfter(dayjs())}
            />
          )}
        />
        <Controller
          control={control}
          name="sales_pic"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Sales Pic"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih sales pic"
            />
          )}
        />
        <Controller
          control={control}
          name="remarks"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Remarks"
              value={value}
              multiline
              inputClassName="min-h-20"
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Masukkan remarks"
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
