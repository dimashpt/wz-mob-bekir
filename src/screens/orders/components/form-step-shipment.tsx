import React, { JSX } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Container, InputField, Text, ToggleSwitch } from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepShipment(): JSX.Element {
  const { control } = useFormContext<OrderFormValues>();

  const watchIsSelfDelivery = useWatch({
    control,
    name: 'delivery.is_self_delivery',
  });

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">Informasi Pengiriman</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          Pengiriman sendiri
        </Text>
        <Controller
          control={control}
          name="delivery.is_self_delivery"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-sm">
        <Controller
          control={control}
          name="delivery.logistic"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <SelectInput
              label="Jasa Pengiriman"
              onSelect={onChange}
              options={[]}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih jasa pengiriman"
            />
          )}
        />

        {watchIsSelfDelivery && (
          <Controller
            control={control}
            name="delivery.logistic_name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                label="Nama Logistik"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                placeholder="Masukkan nama logistik"
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="delivery.logistic_provider_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Nama Provider"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder="Masukkan nama provider"
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.logistic_service_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Nama Layanan"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder="Masukkan nama layanan"
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.logistic_carrier"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Pengangkut Logistik"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder="Masukkan pengangkut logistik"
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.tracking_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Nomor Pelacakan"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder="Masukkan nomor pelacakan"
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
