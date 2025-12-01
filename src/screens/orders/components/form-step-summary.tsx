import React, { JSX } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Container, InputField, Text, ToggleSwitch } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';

export function FormStepSummary(): JSX.Element {
  const { t } = useTranslation();
  const { control } = useFormContext<OrderFormValues>();

  const watchIsShippingCostCoveredBySeller = useWatch({
    control,
    name: 'price.is_shipping_cost_covered_by_seller',
  });

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.order_summary')}</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="price.shipping_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label={t('order_form.shipping_price')}
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
            />
          )}
        />

        <Controller
          control={control}
          name="price.other_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label={t('order_form.other_price')}
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
            />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md flex-row items-center justify-between">
        <Text variant="bodyS">
          {t('order_form.shipping_cost_covered_by_seller')}
        </Text>
        <Controller
          control={control}
          name="price.is_shipping_cost_covered_by_seller"
          render={({ field: { value, onChange } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md flex-row items-center justify-between">
        <Text variant="bodyS">{t('order_form.use_insurance')}</Text>
        <Controller
          control={control}
          name="price.is_using_insurance"
          render={({ field: { value, onChange } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md">
        {watchIsShippingCostCoveredBySeller && (
          <Controller
            control={control}
            name="price.discount_shipping"
            render={({ field: { value, onChange } }) => (
              <InputField
                label={t('order_form.shipping_discount')}
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="0"
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="price.discount_seller"
          render={({ field: { value, onChange } }) => (
            <InputField
              label={t('order_form.order_discount')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />

        <Controller
          control={control}
          name="price.packing_price"
          render={({ field: { value, onChange } }) => (
            <InputField
              label={t('order_form.packing_fee')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
