import React, { JSX, memo } from 'react';
import { View } from 'react-native';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
    placeholder,
  }: {
    search: string;
    setSearch: (value: string) => void;
    isSearchDebouncing: boolean;
    placeholder: string;
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
        placeholder={placeholder}
      />
    </View>
  ),
);

export function FormStepRecipient(): JSX.Element {
  const { t } = useTranslation();
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
    name: 'step_recipient.is_same_as_recipient',
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
          name="step_recipient.recipient.name"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_name')}
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_recipient_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.phone"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_phone')}
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_recipient_phone')}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.email"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_email')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_recipient_email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.sub_district"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <SelectInput
              label={t('order_form.recipient_subdistrict')}
              onSelect={(value) => {
                onChange(value);

                if (value?.data) {
                  form.setValue(
                    'step_recipient.recipient.country',
                    value?.data?.country,
                    { shouldValidate: true },
                  );
                  form.setValue(
                    'step_recipient.recipient.province',
                    value?.data?.state,
                    { shouldValidate: true },
                  );
                  form.setValue(
                    'step_recipient.recipient.city',
                    value?.data?.city,
                    { shouldValidate: true },
                  );
                  form.setValue(
                    'step_recipient.recipient.district',
                    value?.data?.district,
                    { shouldValidate: true },
                  );
                  form.setValue(
                    'step_recipient.recipient.postal_code',
                    value?.data?.postcode,
                    { shouldValidate: true },
                  );
                }
              }}
              mandatory
              options={addresses ?? []}
              value={value?.label}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder={t('order_form.select_subdistrict')}
              flatListProps={{
                stickyHeaderIndices: [0],
                ListHeaderComponent: () => (
                  <SearchBar
                    search={search}
                    setSearch={setSearch}
                    isSearchDebouncing={isSearchDebouncing}
                    placeholder={t('order_form.search_subdistrict')}
                  />
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.country"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_country')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.recipient_country')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.province"
          disabled
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_province')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.recipient_province')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.city"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_city')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.recipient_city')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.district"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_district')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.recipient_district')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.postal_code"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_postal_code')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.recipient_postal_code')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.full_address"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              mandatory
              label={t('order_form.recipient_full_address')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder={t('order_form.enter_recipient_address')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.recipient.remarks"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.recipient_remarks')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder={t('order_form.enter_recipient_remarks')}
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">{t('order_form.customer_information')}</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          {t('order_form.same_as_recipient')}
        </Text>
        <Controller
          control={control}
          name="step_recipient.is_same_as_recipient"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      {!isSameAsRecipient && (
        <Container.Card className="p-lg gap-md">
          <Controller
            control={control}
            name="step_recipient.customer.name"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                mandatory
                label={t('order_form.customer_name')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_customer_name')}
              />
            )}
          />

          <Controller
            control={control}
            name="step_recipient.customer.phone"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                mandatory
                label={t('order_form.customer_phone')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_customer_phone')}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="step_recipient.customer.email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                mandatory
                label={t('order_form.customer_email')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_customer_email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="step_recipient.customer.full_address"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                mandatory
                label={t('order_form.customer_full_address')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_customer_address')}
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
