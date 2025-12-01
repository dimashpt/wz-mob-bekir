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
import { formatCurrency } from '@/utils/formatter';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepShipment(): JSX.Element {
  const { t } = useTranslation();
  const { control, ...form } = useFormContext<OrderFormValues>();

  const watchIsSelfDelivery = useWatch({
    control,
    name: 'delivery.is_self_delivery',
  });

  const { data: logisticProviders } = ShipmentRepo.useLogisticProvidersQuery({
    select: (data) =>
      data.map((provider) => ({
        label: [provider.pattern, formatCurrency(provider.price ?? 0)].join(
          ' - ',
        ),
        // Joining value to make it unique and handles multiple services from same provider
        value: [provider.provider_code, provider.service_type].join('@'),
        data: provider,
      })),
  });

  type LogisticInner = {
    provider_name?: string;
    service_type?: string;
    pattern?: string;
  } | null;

  type LogisticOption =
    | ({
        label?: string;
        value?: string;
        data?: LogisticInner;
      } & object)
    | null;

  function handleSelfDeliveryChange(value: boolean): void {
    form.setValue('delivery.is_self_delivery', value);
    if (value) {
      form.setValue('delivery.logistic', null);
      form.setValue('delivery.logistic_name', '');
      form.setValue('delivery.logistic_provider_name', '');
      form.setValue('delivery.logistic_service_name', '');
      form.setValue('delivery.logistic_carrier', '');
      form.setValue('delivery.tracking_number', '');
    }
  }

  function handleLogisticSelect(value: LogisticOption): void {
    form.setValue('delivery.logistic', value as Option);
    form.setValue(
      'delivery.logistic_provider_name',
      value?.data?.provider_name || '',
    );
    form.setValue(
      'delivery.logistic_service_name',
      value?.data?.service_type || '',
    );
    form.setValue('delivery.logistic_carrier', value?.data?.pattern ?? '');
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.delivery_information')}</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          {t('order_form.self_delivery')}
        </Text>
        <Controller
          control={control}
          name="delivery.is_self_delivery"
          render={({ field: { value } }) => (
            <ToggleSwitch
              value={value}
              size="small"
              onValueChange={handleSelfDeliveryChange}
            />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-sm">
        <Controller
          control={control}
          name="delivery.logistic"
          render={({ field: { value }, fieldState: { error } }) => (
            <SelectInput
              label={t('order_form.logistic_service')}
              onSelect={handleLogisticSelect}
              options={logisticProviders || []}
              value={value?.label}
              error={!!error?.message}
              errors={[error?.message]}
              placeholder={t('order_form.select_logistic')}
            />
          )}
        />

        {watchIsSelfDelivery && (
          <Controller
            control={control}
            name="delivery.logistic_name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                label={t('order_form.logistic_name')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                placeholder={t('order_form.enter_logistic_name')}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="delivery.logistic_provider_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.provider_name')}
              value={value}
              disabled={!watchIsSelfDelivery}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder={t('order_form.enter_provider_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.logistic_service_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.service_name')}
              value={value}
              disabled={!watchIsSelfDelivery}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder={t('order_form.enter_service_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.logistic_carrier"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.logistic_carrier')}
              value={value}
              disabled={!watchIsSelfDelivery}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder={t('order_form.enter_carrier_name')}
            />
          )}
        />

        <Controller
          control={control}
          name="delivery.tracking_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.tracking_number')}
              value={value}
              disabled={!watchIsSelfDelivery}
              error={!!error?.message}
              errors={[error?.message]}
              onChangeText={onChange}
              placeholder={t('order_form.enter_tracking_number')}
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
