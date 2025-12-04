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
import { ShipmentRepo } from '@/services';
import { LogisticProvider } from '@/services/shipment/types';
import { formatCurrency } from '@/utils/formatter';
import { OrderFormValues } from '../utils/order-form-schema';

export function FormStepShipment(): JSX.Element {
  const { t } = useTranslation();
  const { control, ...form } = useFormContext<OrderFormValues>();

  const watchIsSelfDelivery = useWatch({
    control,
    name: 'step_shipment.is_self_delivery',
  });
  const watchWarehouseId = useWatch({
    control,
    name: 'step_order.warehouse',
  });
  const watchRecipientSubDistrict = useWatch({
    control,
    name: 'step_recipient.subdistrict',
  });
  const watchWeight = useWatch({
    control,
    name: 'step_item.package.weight',
  });
  const watchLogistics = useWatch({
    control,
    name: 'step_shipment.logistic',
  });

  const { data: logisticProviders, isFetching } =
    ShipmentRepo.useLogisticProvidersQuery(
      {
        select: (data) => ({
          data: data.map((provider) => ({
            label: [provider.pattern, formatCurrency(provider.price ?? 0)].join(
              ' - ',
            ),
            // Joining value to make it unique and handles multiple services from same provider
            value: [provider.provider_code, provider.service_type].join('@'),
            data: provider,
          })),
        }),
      },
      {
        destination_code:
          watchRecipientSubDistrict?.data?.subdistrict_code ?? '',
        origin_code: watchWarehouseId?.data?.origin_code ?? '',
        weight: watchWeight,
      },
    );

  function handleSelfDeliveryChange(value: boolean): void {
    form.setValue('step_shipment.is_self_delivery', value, {
      shouldValidate: true,
    });

    if (value) {
      form.resetField('step_shipment.logistic');
      form.resetField('step_shipment.logistic_name');
      form.resetField('step_shipment.logistic_provider_name');
      form.resetField('step_shipment.logistic_service_name');
      form.resetField('step_shipment.logistic_carrier');
      form.resetField('step_shipment.tracking_number');
    }
  }

  function handleLogisticSelect(value: Option<LogisticProvider> | null): void {
    form.setValue('step_shipment.logistic', value!);
    form.setValue(
      'step_shipment.logistic_provider_name',
      value?.data?.provider_name || '',
    );
    form.setValue(
      'step_shipment.logistic_service_name',
      value?.data?.service_type || '',
    );
    form.setValue('step_shipment.logistic_carrier', value?.data?.pattern ?? '');

    // Set summary
    form.setValue('step_shipment.shipping_fee', value?.data?.price || 0);
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.delivery_information')}</Text>
      <Container.Card className="gap-sm flex-row items-center justify-between">
        <Text variant="bodyS" className="font-medium">
          {t('order_form.is_self_delivery')}
        </Text>
        <Controller
          control={control}
          name="step_shipment.is_self_delivery"
          render={({ field: { value } }) => (
            <ToggleSwitch
              value={!!value}
              size="small"
              onValueChange={handleSelfDeliveryChange}
            />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-sm">
        <Controller
          control={control}
          name="step_shipment.logistic"
          render={({ field: { value }, fieldState: { error } }) => (
            <SelectInput
              label={t('order_form.logistic')}
              onSelect={handleLogisticSelect}
              loading={isFetching}
              disabled={isFetching}
              mandatory
              options={logisticProviders?.data || []}
              value={value?.label}
              errors={error?.message}
              placeholder={t('order_form.select_logistic')}
            />
          )}
        />

        {watchIsSelfDelivery && (
          <Controller
            control={control}
            name="step_shipment.logistic_name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                label={t('order_form.logistic_name')}
                value={value}
                errors={error?.message}
                onChangeText={onChange}
                placeholder={t('order_form.enter_logistic_name')}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="step_shipment.logistic_provider_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.provider_name')}
              value={value}
              disabled={!watchIsSelfDelivery}
              errors={error?.message}
              onChangeText={onChange}
              placeholder={t('order_form.enter_provider_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_shipment.logistic_service_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.service_name')}
              value={value}
              disabled={!watchIsSelfDelivery}
              errors={error?.message}
              onChangeText={onChange}
              placeholder={t('order_form.enter_service_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_shipment.logistic_carrier"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.logistic_carrier')}
              value={value}
              disabled={!watchIsSelfDelivery}
              errors={error?.message}
              onChangeText={onChange}
              placeholder={t('order_form.enter_carrier_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="step_shipment.tracking_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.tracking_number')}
              value={value}
              disabled={!watchIsSelfDelivery}
              errors={error?.message}
              onChangeText={onChange}
              placeholder={t('order_form.enter_tracking_number')}
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">{t('order_form.fees_and_discounts')}</Text>
      <Container.Card className="p-lg gap-sm">
        <Controller
          control={control}
          name="step_shipment.shipping_fee"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.shipping_fee')}
              value={value?.toString()}
              onChangeText={onChange}
              disabled={Boolean(watchLogistics?.value)}
              placeholder="0"
              errors={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="step_shipment.shipping_discount"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.shipping_discount')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
              errors={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="step_shipment.packing_fee"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.packing_fee')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
              errors={error?.message}
            />
          )}
        />
      </Container.Card>

      <Container.Card className="flex-row items-center justify-between">
        <Text variant="bodyS" className="font-medium">
          {t('order_form.use_insurance')}
        </Text>
        <Controller
          control={control}
          name="step_shipment.is_using_insurance"
          render={({ field: { value, onChange } }) => (
            <ToggleSwitch
              value={!!value}
              size="small"
              onValueChange={onChange}
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
