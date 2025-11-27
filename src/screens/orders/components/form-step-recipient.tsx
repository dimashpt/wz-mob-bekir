import React, { JSX } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Container, InputField, Text, ToggleSwitch } from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepRecipient(): JSX.Element {
  const { control } = useFormContext<OrderFormValues>();
  const isSameAsRecipient = useWatch({
    control,
    name: 'is_same_as_recipient',
  });

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">Informasi Penerima</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="recipient.name"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Nama Penerima"
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan nama penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.phone"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="No. HP Penerima"
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan no. hp penerima"
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.email"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Email Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan email penerima"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.sub_district"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              label="Kelurahan/Desa Penerima"
              onSelect={onChange}
              options={[]}
              value={value}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih kelurahan/desa penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.country"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Negara Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan negara penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.province"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Provinsi Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan provinsi penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.city"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Kota Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan kota penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.district"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Kecamatan Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan kecamatan penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.postal_code"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Kode Pos Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Masukkan kode pos penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.full_address"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Alamat Lengkap Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder="Masukkan alamat lengkap penerima"
            />
          )}
        />

        <Controller
          control={control}
          name="recipient.remarks"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Catatan Penerima"
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder="Masukkan catatan penerima"
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">Customer Information</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          Samakan dengan penerima
        </Text>
        <Controller
          control={control}
          name="is_same_as_recipient"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      {!isSameAsRecipient && (
        <Container.Card className="p-lg gap-md">
          <Controller
            control={control}
            name="buyer.name"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Nama Customer"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan nama customer"
              />
            )}
          />

          <Controller
            control={control}
            name="recipient.phone"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="No. HP Customer"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan no. hp customer"
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="recipient.email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Email Customer"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan email customer"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="buyer.full_address"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Alamat Lengkap Customer"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan alamat lengkap customer"
                multiline
                inputClassName="min-h-20"
              />
            )}
          />
        </Container.Card>
      )}
    </Container.Scroll>
  );
}
