import React, { JSX } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Container,
  InputField,
  Option,
  Text,
  ToggleSwitch,
} from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useDebounce } from '@/hooks';
import { Address } from '@/services/order';
import { useAddressQuery } from '@/services/order/repository';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepRecipient(): JSX.Element {
  const { t } = useTranslation();
  const [, setSearch, debouncedSearch] = useDebounce();
  const { data: addresses, isFetching } = useAddressQuery(
    {
      enabled: debouncedSearch?.length >= 3 || debouncedSearch.length === 0,
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

  function onSubdistrictChange(value: Option<Address> | null): void {
    form.setValue('step_recipient.subdistrict', value!);
    if (value?.data) {
      form.setValue('step_recipient.country', value?.data?.country, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.province', value?.data?.state, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.city', value?.data?.city, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.district', value?.data?.district, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.postal_code', value?.data?.postcode, {
        shouldValidate: true,
      });
    }
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.recipient_information')}</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="step_recipient.name"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.name')}
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.phone"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.phone')}
              mandatory
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_phone')}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.email"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.email')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.subdistrict"
          render={({ field: { value, onBlur }, fieldState: { error } }) => (
            <SelectInput
              label={t('order_form.subdistrict')}
              onSelect={onSubdistrictChange}
              mandatory
              options={addresses ?? []}
              value={value?.label}
              onBlur={onBlur}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder={t('order_form.select_subdistrict')}
              search={{
                isLoading: isFetching,
                placeholder: t('order_form.search_subdistrict'),
                onSearchChange: setSearch,
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.country"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.country')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.country')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.province"
          disabled
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.province')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.province')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.city"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.city')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.city')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.district"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.district')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.district')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.postal_code"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.postal_code')}
              mandatory
              disabled
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.postal_code')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.full_address"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              mandatory
              label={t('order_form.full_address')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder={t('order_form.enter_full_address')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_recipient.remarks"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputField
              label={t('order_form.remarks')}
              value={value}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder={t('order_form.enter_remarks')}
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">{t('order_form.customer_information')}</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          {t('order_form.is_same_as_recipient')}
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
                label={t('order_form.customer.name')}
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
                label={t('order_form.customer.phone')}
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
                label={t('order_form.customer.email')}
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
                label={t('order_form.customer.full_address')}
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
