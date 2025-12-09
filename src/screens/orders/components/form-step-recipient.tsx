import React, { JSX, useRef } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Container,
  InputField,
  Option,
  SelectSearch,
  SelectSearchRef,
  Text,
  ToggleSwitch,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useDebounce } from '@/hooks';
import { Address } from '@/services/order';
import { useAddressQuery } from '@/services/order/repository';
import { OrderFormValues } from '../utils/order-form-schema';

export function FormStepRecipient(): JSX.Element {
  const subdistrictSearchRef = useRef<SelectSearchRef>(null);
  const { t } = useTranslation();
  const [
    ,
    setSubdistrictSearch,
    debouncedSubdistrictSearch,
    isSearchDebouncing,
  ] = useDebounce();
  const { data: addresses, isFetching } = useAddressQuery(
    {
      enabled:
        debouncedSubdistrictSearch?.length >= 3 ||
        debouncedSubdistrictSearch.length === 0,
      select: (data) =>
        data.destinations.map((address) => ({
          data: address,
          label: address.subdistrict,
          description: [
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
    debouncedSubdistrictSearch,
  );

  const { control, ...form } = useFormContext<OrderFormValues>();
  const isSameAsCustomer = useWatch({
    control,
    name: 'step_recipient.is_same_as_customer',
  });

  function onSubdistrictChange(value: Option<Address> | null): void {
    if (!value) {
      return;
    }
    form.setValue('step_recipient.subdistrict', value, {
      shouldValidate: true,
    });
    if (value.data) {
      form.setValue('step_recipient.country', value.data.country, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.province', value.data.state, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.city', value.data.city, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.district', value.data.district, {
        shouldValidate: true,
      });
      form.setValue('step_recipient.postal_code', value.data.postcode, {
        shouldValidate: true,
      });
    }
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.customer_information')}</Text>

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
              errors={error?.message}
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
              errors={error?.message}
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
              errors={error?.message}
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
              errors={error?.message}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('order_form.enter_customer_address')}
              multiline
              inputClassName="min-h-20"
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">{t('order_form.recipient_information')}</Text>
      <Container.Card className="gap-sm flex-row items-center justify-between">
        <Text variant="bodyS" className="font-medium">
          {t('order_form.is_same_as_customer')}
        </Text>
        <Controller
          control={control}
          name="step_recipient.is_same_as_customer"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

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
              mandatory={!isSameAsCustomer}
              disabled={isSameAsCustomer}
              value={value}
              errors={error?.message}
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
              mandatory={!isSameAsCustomer}
              disabled={isSameAsCustomer}
              value={value}
              errors={error?.message}
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
              disabled={isSameAsCustomer}
              errors={error?.message}
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
            <SelectSearch
              ref={subdistrictSearchRef}
              label={t('order_form.subdistrict')}
              mandatory
              placeholder={t('order_form.select_subdistrict')}
              title={t('order_form.subdistrict')}
              selected={value}
              options={addresses ?? []}
              errors={error?.message}
              onBlur={onBlur}
              onSelect={onSubdistrictChange}
              search={{
                onSearchChange: setSubdistrictSearch,
                placeholder: t('order_form.search_subdistrict'),
                isLoading: isFetching || isSearchDebouncing,
              }}
              helpers={t('order_form.helpers.recipient_address_change')}
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
              errors={error?.message}
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
              errors={error?.message}
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
              errors={error?.message}
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
              errors={error?.message}
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
              errors={error?.message}
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
              mandatory={!isSameAsCustomer}
              label={t('order_form.full_address')}
              value={value}
              disabled={isSameAsCustomer}
              errors={error?.message}
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
              errors={error?.message}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              inputClassName="min-h-20"
              placeholder={t('order_form.enter_remarks')}
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
