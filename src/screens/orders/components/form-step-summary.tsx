import React, { JSX } from 'react';
import { View } from 'react-native';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Container, Divider, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { formatCurrency } from '@/utils/formatter';
import { usePriceCalculations } from '../context/price-calculations-context';
import { OrderFormValues } from '../utils/order-form-schema';

function PriceInfo({
  label,
  value,
  error,
}: {
  label: string;
  value: string | number;
  error?: boolean;
}): React.JSX.Element {
  return (
    <View className="gap-sm flex-row items-center justify-between">
      <Text variant="labelS" color={error ? 'danger' : 'default'}>
        {label}
      </Text>
      <Divider
        className={twMerge(
          'mx-sm bg-muted flex-1',
          error ? 'bg-danger-soft' : '',
        )}
      />
      <Text variant="labelS" color={error ? 'danger' : 'default'}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

export function FormStepSummary(): JSX.Element {
  const { t } = useTranslation();
  const { control } = useFormContext<OrderFormValues>();
  const { subTotal, insuranceFee, codFee, totalDiscount, grandTotal } =
    usePriceCalculations();

  const watchProducts = useWatch({
    control,
    name: 'step_item.products',
  });
  const watchShippingFee = useWatch({
    control,
    name: 'step_shipment.shipping_fee',
  });
  const watchPackingFee = useWatch({
    control,
    name: 'step_shipment.packing_fee',
  });

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.order_summary')}</Text>

      <PriceInfo
        label={`${t('order_form.subtotal')} (${watchProducts?.length || 0} ${t('order_form.item')})`}
        value={subTotal}
      />
      <PriceInfo
        label={t('order_form.shipping_fee')}
        value={watchShippingFee || 0}
      />
      <PriceInfo label={t('order_form.insurance_fee')} value={insuranceFee} />
      <PriceInfo label={t('order_form.cod_fee')} value={codFee} />
      <PriceInfo
        label={t('order_form.packing_fee_label')}
        value={watchPackingFee || 0}
      />
      <PriceInfo
        label={t('order_form.discount')}
        value={totalDiscount}
        error={totalDiscount > 0}
      />
      <PriceInfo
        label={t('order_form.total')}
        value={grandTotal}
        error={grandTotal < 0}
      />
    </Container.Scroll>
  );
}
