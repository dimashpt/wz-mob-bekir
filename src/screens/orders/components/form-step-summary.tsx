import React, { JSX } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Container, InputField, Text, ToggleSwitch } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepSummary(): JSX.Element {
  const { control } = useFormContext<OrderFormValues>();

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">Order Summary</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="price.shipping_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Shipping Price"
              value={value?.toString()}
              onChangeText={onChange}
              disabled
              placeholder="0"
            />
          )}
        />

        <Controller
          control={control}
          name="price.other_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Other Price"
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
            />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md flex-row items-center justify-between">
        <Text variant="bodyS">Biaya Pengiriman Ditanggung Penjual</Text>
        <Controller
          control={control}
          name="price.is_shipping_cost_covered_by_seller"
          render={({ field: { value, onChange } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md flex-row items-center justify-between">
        <Text variant="bodyS">Gunakan Asuransi Pengiriman</Text>
        <Controller
          control={control}
          name="price.is_using_insurance"
          render={({ field: { value, onChange } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md">
        <Controller
          control={control}
          name="price.discount_seller"
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Diskon Pesanan"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />

        <Controller
          control={control}
          name="price.packing_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Biaya Packing"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
