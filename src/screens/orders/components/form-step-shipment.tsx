import React, { JSX } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Container, InputField, Text, ToggleSwitch } from '@/components';
import SelectInput from '@/components/select-input';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepShipment(): JSX.Element {
  const { t } = useTranslation();
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
      <Text variant="labelL">{t('order_form.delivery_information')}</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          {t('order_form.self_delivery')}
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
              label={t('order_form.logistic_service')}
              onSelect={onChange}
              options={[]}
              value={value}
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
