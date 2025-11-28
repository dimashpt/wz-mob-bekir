import React, { JSX, memo } from 'react';
import { View } from 'react-native';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Container, Icon, InputField, Text, ToggleSwitch } from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useDebounce } from '@/hooks';
import { useAddressQuery } from '@/services/order/repository';
import { OrderFormValues } from '../helpers/order-form';

const SearchBar = memo(
  ({
    search,
    setSearch,
    isSearchDebouncing,
  }: {
    search: string;
    setSearch: (value: string) => void;
    isSearchDebouncing: boolean;
  }) => (
    <View className="px-md pb-sm bg-surface">
      <InputField
        left={
          <Icon name="search" size="lg" className="text-muted-foreground" />
        }
        className="gap-xs min-h-8 rounded-full"
        inputClassName="min-h-8"
        loading={isSearchDebouncing}
        value={search}
        onChangeText={setSearch}
        placeholder="Masukkan nama kelurahan/desa penerima"
      />
    </View>
  ),
);

export function FormStepRecipient(): JSX.Element {
  const [search, setSearch, debouncedSearch, isSearchDebouncing] =
    useDebounce();
  const { data: addresses } = useAddressQuery(
    {
      select: (data) =>
        data.destinations.map((address) => ({
          data: address,
          label: [
            address.subdistrict,
            address.district,
            address.city,
            address.state,
            address.country,
            address.postcode,
          ]
            .filter(Boolean)
            .join(', '),
          value: address.subdistrict_code,
        })),
    },
    debouncedSearch,
  );

  const { control, ...form } = useFormContext<OrderFormValues>();
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
              onSelect={(value) => {
                onChange(value);

                if (value?.data) {
                  form.setValue('recipient.country', value?.data?.country);
                  form.setValue('recipient.province', value?.data?.state);
                  form.setValue('recipient.city', value?.data?.city);
                  form.setValue('recipient.district', value?.data?.district);
                  form.setValue('recipient.postal_code', value?.data?.postcode);
                }
              }}
              mandatory
              options={addresses ?? []}
              value={value?.label}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder="Pilih kelurahan/desa penerima"
              flatListProps={{
                stickyHeaderIndices: [0],
                ListHeaderComponent: () => (
                  <SearchBar
                    search={search}
                    setSearch={setSearch}
                    isSearchDebouncing={isSearchDebouncing}
                  />
                ),
              }}
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
              mandatory
              disabled
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
          disabled
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label="Provinsi Penerima"
              mandatory
              disabled
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
              mandatory
              disabled
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
              mandatory
              disabled
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
              mandatory
              disabled
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
              mandatory
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
                mandatory
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
                mandatory
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
                mandatory
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
                mandatory
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
