import React, { JSX, useRef } from 'react';
import { View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Chip,
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
import { orderEndpoints } from '../constants/endpoints';
import { useOrderForm } from '../context/order-form-context';
import { Customer, CustomerAddress } from '../services/customer';
import { useCustomersQuery } from '../services/customer/repository';
import { Address, AddressRequestParams, getAddress } from '../services/order';
import { useAddressQuery } from '../services/order/repository';
import { OrderFormValues } from '../utils/order-form-schema';

export function FormStepRecipient(): JSX.Element {
  const customerSearchRef = useRef<SelectSearchRef>(null);
  const subdistrictSearchRef = useRef<SelectSearchRef>(null);
  const { t } = useTranslation();
  const [
    ,
    setSubdistrictSearch,
    debouncedSubdistrictSearch,
    isAddressSearchDebouncing,
  ] = useDebounce();
  const [
    ,
    setCustomerSearch,
    debouncedCustomerSearch,
    isCustomerSearchDebouncing,
  ] = useDebounce();

  const { data: addresses, isFetching: isAddressSearchFetching } =
    useAddressQuery(
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

  const { data: customers, isFetching: isCustomerSearchFetching } =
    useCustomersQuery(
      {
        enabled: debouncedCustomerSearch?.length >= 3,
        select: (data) =>
          data.data.map((customer) => ({
            label: customer.name,
            value: customer.id?.toString(),
            description: customer.address.full_address,
            data: customer,
          })),
      },
      { search: debouncedCustomerSearch },
    );

  // Handle the address search mutation
  const searchAddressesMutation = useMutation({
    mutationKey: [orderEndpoints.address],
    mutationFn: (params: AddressRequestParams & { address: CustomerAddress }) =>
      getAddress({
        page: 1,
        per_page: 10,
        search_by: 'subdistrict',
        search: params.address.subdistrict,
      }),
    onMutate: (variables) => {
      /**
       * Initialize the form fields for the province, city, district,
       * and postal code to the exact address. But, the country and subdistrict
       * will be empty because it's not provided by the API. When this mutation is successful,
       * the exact address will be selected and the form fields will be updated.
       */
      form.setValue('step_recipient.province', variables?.address?.state ?? '');
      form.setValue('step_recipient.city', variables?.address?.city ?? '');
      form.setValue(
        'step_recipient.district',
        variables?.address?.district ?? '',
      );
      form.setValue(
        'step_recipient.postal_code',
        variables?.address?.postal_code ?? '',
      );
    },
    onSuccess: (addresses, variables) => {
      // Find the exact address from the API response
      const exactAddress = addresses.destinations.find(
        (address) =>
          address.district === variables?.address?.district &&
          address.city === variables?.address?.city &&
          address.postcode === variables?.address?.postal_code,
      );

      // If the exact address is found, select the exact address
      if (exactAddress) {
        onSelectSubdistrict({
          label: exactAddress.subdistrict ?? '',
          value: exactAddress.subdistrict_code ?? '',
          data: exactAddress,
        });

        return;
      }

      // Use hardcoded string error because this won't be thrown to the UI
      throw new Error('Exact address not found');
    },
    onError: () => form.trigger('step_recipient.subdistrict'),
  });

  const { control, ...form } = useFormContext<OrderFormValues>();
  const { resetLogistic } = useOrderForm();
  const isSameAsCustomer = useWatch({
    control,
    name: 'step_recipient.is_same_as_customer',
  });
  const watchCustomer = useWatch({
    control,
    name: 'step_recipient.customer',
  });

  function onSelectSubdistrict(value: Option<Address> | null): void {
    if (!value) {
      return;
    }

    form.setValue('step_recipient.subdistrict', value, {
      shouldValidate: true,
    });

    resetLogistic();

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

  async function onSelectCustomer(
    value: Option<Customer> | null,
  ): Promise<void> {
    if (!value) return;

    form.setValue('step_recipient.customer.name', value, {
      shouldValidate: true,
    });

    form.setValue('step_recipient.customer.phone', value.data?.phone ?? '', {
      shouldValidate: Boolean(value.data?.phone),
    });
    form.setValue('step_recipient.customer.email', value.data?.email ?? '', {
      shouldValidate: Boolean(value.data?.email),
    });
    form.setValue(
      'step_recipient.customer.full_address',
      value.data?.address.full_address ?? '',
      { shouldValidate: Boolean(value.data?.address.full_address) },
    );

    form.setValue(
      'step_recipient.is_same_as_customer',
      Boolean(value.data?.id),
    );

    /**
     * NOTES: Due to the API response is not providing subdistrict_code and country,
     * we need to fetch the subdistrict code and country from the API, and select
     * the exact address from the API response.
     */
    if (value.data?.address) {
      setSubdistrictSearch(value.data?.address?.subdistrict ?? '');

      searchAddressesMutation.mutate({
        page: 1,
        per_page: 10,
        search_by: 'subdistrict',
        search: value.data?.address?.subdistrict ?? '',
        address: value.data?.address as CustomerAddress,
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
          render={({ field: { value, onBlur }, fieldState: { error } }) => (
            <SelectSearch
              ref={customerSearchRef}
              label={t('order_form.customer.name')}
              mandatory
              allowCreation
              placeholder={t('order_form.enter_customer_name')}
              title={t('order_form.customer.name')}
              selected={value}
              options={customers ?? []}
              errors={error?.message}
              onBlur={onBlur}
              onSelect={onSelectCustomer}
              renderItem={({ item }) => (
                <View className="gap-xs">
                  <View className="gap-xs flex-1 flex-row items-center justify-between">
                    <View className="gap-xs shrink flex-row items-center">
                      <Text
                        variant="bodyS"
                        className="font-map-medium shrink font-medium"
                      >
                        {`${item.label} (${item.data?.phone})`}
                      </Text>
                    </View>
                    <Chip
                      label={t('order_form.customer.total_orders', {
                        count: item.data?.total_orders,
                      })}
                      variant="blue"
                    />
                  </View>
                  <Text variant="bodyXS" color="muted">
                    {item.description}
                  </Text>
                </View>
              )}
              search={{
                onSearchChange: setCustomerSearch,
                placeholder: t('order_form.enter_customer_name'),
                isLoading:
                  isCustomerSearchDebouncing || isCustomerSearchFetching,
              }}
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
              value={isSameAsCustomer ? watchCustomer?.name?.label : value}
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
              value={isSameAsCustomer ? watchCustomer?.phone : value}
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
              value={isSameAsCustomer ? watchCustomer?.email : value}
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
              onSelect={onSelectSubdistrict}
              loading={searchAddressesMutation.isPending}
              search={{
                onSearchChange: setSubdistrictSearch,
                placeholder: t('order_form.search_subdistrict'),
                isLoading: isAddressSearchFetching || isAddressSearchDebouncing,
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
              value={isSameAsCustomer ? watchCustomer?.full_address : value}
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
