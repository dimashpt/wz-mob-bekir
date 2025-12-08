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
import { OrderFormValues } from '../utils/order-form-schema';

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
  const isSameAsCustomer = useWatch({
    control,
    name: 'step_recipient.is_same_as_customer',
  });

  function onSubdistrictChange(value: Option<Address> | null): void {
    form.setValue('step_recipient.subdistrict', value!, {
      shouldValidate: true,
    });
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
      <Text variant="labelL">{t('order_form.customer_information')}</Text>

      <Container.Card className="p-lg gap-md">
        <InputField
          control={control}
          name="step_recipient.customer.name"
          mandatory
          label={t('order_form.customer.name')}
          placeholder={t('order_form.enter_customer_name')}
        />

        <InputField
          control={control}
          name="step_recipient.customer.phone"
          mandatory
          label={t('order_form.customer.phone')}
          placeholder={t('order_form.enter_customer_phone')}
          keyboardType="phone-pad"
        />

        <InputField
          control={control}
          name="step_recipient.customer.email"
          mandatory
          label={t('order_form.customer.email')}
          placeholder={t('order_form.enter_customer_email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          control={control}
          name="step_recipient.customer.full_address"
          mandatory
          label={t('order_form.customer.full_address')}
          placeholder={t('order_form.enter_customer_address')}
          multiline
          inputClassName="min-h-20"
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
        <InputField
          control={control}
          name="step_recipient.name"
          label={t('order_form.name')}
          mandatory={!isSameAsCustomer}
          disabled={isSameAsCustomer}
          placeholder={t('order_form.enter_name')}
        />

        <InputField
          control={control}
          name="step_recipient.phone"
          label={t('order_form.phone')}
          mandatory={!isSameAsCustomer}
          disabled={isSameAsCustomer}
          placeholder={t('order_form.enter_phone')}
          keyboardType="phone-pad"
        />

        <InputField
          control={control}
          name="step_recipient.email"
          label={t('order_form.email')}
          disabled={isSameAsCustomer}
          placeholder={t('order_form.enter_email')}
          keyboardType="email-address"
          autoCapitalize="none"
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
              errors={error?.message}
              placeholder={t('order_form.select_subdistrict')}
              search={{
                isLoading: isFetching,
                placeholder: t('order_form.search_subdistrict'),
                onSearchChange: setSearch,
              }}
            />
          )}
        />

        <InputField
          control={control}
          name="step_recipient.country"
          label={t('order_form.country')}
          mandatory
          disabled
          placeholder={t('order_form.country')}
        />

        <InputField
          control={control}
          name="step_recipient.province"
          label={t('order_form.province')}
          mandatory
          disabled
          placeholder={t('order_form.province')}
        />

        <InputField
          control={control}
          name="step_recipient.city"
          label={t('order_form.city')}
          mandatory
          disabled
          placeholder={t('order_form.city')}
        />

        <InputField
          control={control}
          name="step_recipient.district"
          label={t('order_form.district')}
          mandatory
          disabled
          placeholder={t('order_form.district')}
        />

        <InputField
          control={control}
          name="step_recipient.postal_code"
          label={t('order_form.postal_code')}
          mandatory
          disabled
          placeholder={t('order_form.postal_code')}
        />

        <InputField
          control={control}
          name="step_recipient.full_address"
          mandatory={!isSameAsCustomer}
          label={t('order_form.full_address')}
          disabled={isSameAsCustomer}
          multiline
          inputClassName="min-h-20"
          placeholder={t('order_form.enter_full_address')}
        />

        <InputField
          control={control}
          name="step_recipient.remarks"
          label={t('order_form.remarks')}
          multiline
          inputClassName="min-h-20"
          placeholder={t('order_form.enter_remarks')}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
