import React, { JSX, useMemo } from 'react';
import { View } from 'react-native';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Container, Divider, InputField, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { formatCurrency } from '@/utils/formatter';
import { OrderFormValues } from '../helpers/order-form';

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

  const watchShippingPrice = useWatch({
    control,
    name: 'step_shipment.shipping_price',
  });
  const watchShippingDiscount = useWatch({
    control,
    name: 'step_shipment.shipping_discount',
  });
  const watchOrderDiscount = useWatch({
    control,
    name: 'step_summary.order_discount',
  });
  const watchProducts = useWatch({
    control,
    name: 'step_item.products',
  });
  const watchLogistics = useWatch({
    control,
    name: 'step_shipment.logistic',
  });
  const watchPaymentMethod = useWatch({
    control,
    name: 'step_order.payment_method_type',
  });
  const watchIsUsingInsurance = useWatch({
    control,
    name: 'step_shipment.is_using_insurance',
  });
  const watchOtherFees = useWatch({
    control,
    name: 'step_summary.other_fee',
  });
  const watchPackingFee = useWatch({
    control,
    name: 'step_shipment.packing_fee',
  });

  const subTotal = useMemo(() => {
    const totalPrice = watchProducts?.reduce((total, product) => {
      const productPrice = Number(product.published_price) || 0;
      const quantity = product.quantity || 0;
      return total + productPrice * quantity;
    }, 0);

    return totalPrice || 0;
  }, [watchProducts]);

  const insuranceFee = useMemo(() => {
    if (!watchIsUsingInsurance) return 0;

    if (watchLogistics?.data?.insurance_percentage && subTotal > 0) {
      return (subTotal * watchLogistics?.data.insurance_percentage) / 100;
    }

    return 0;
  }, [watchLogistics, subTotal, watchIsUsingInsurance]);

  const codFee = useMemo(() => {
    if (
      watchPaymentMethod?.value === 'COD' &&
      watchLogistics?.data?.cod_percentage &&
      subTotal > 0
    ) {
      return (subTotal * watchLogistics?.data.cod_percentage) / 100;
    }
    return 0;
  }, [watchPaymentMethod, watchLogistics, subTotal]);

  const totalDiscount = useMemo(() => {
    return Number(watchShippingDiscount || 0) + Number(watchOrderDiscount || 0);
  }, [watchShippingDiscount, watchOrderDiscount]);

  const totalPrice = useMemo(() => {
    const total =
      subTotal +
      (Number(watchShippingPrice) || 0) +
      (Number(watchOtherFees) || 0) +
      (Number(watchPackingFee) || 0) +
      insuranceFee +
      codFee -
      totalDiscount;
    return total;
  }, [
    subTotal,
    watchShippingPrice,
    watchOtherFees,
    watchPackingFee,
    totalDiscount,
    codFee,
    insuranceFee,
  ]);

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.order_summary')}</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="step_summary.other_fee"
          render={({ field: { value, onChange } }) => (
            <InputField
              label={t('order_form.other_fees')}
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
            />
          )}
        />
      </Container.Card>

      <Container.Card className="p-md gap-md">
        <Controller
          control={control}
          name="step_summary.order_discount"
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
      </Container.Card>

      <PriceInfo
        label={`${t('order_form.subtotal')} (${watchProducts?.length || 0} ${t('order_form.item')})`}
        value={subTotal}
      />
      <PriceInfo
        label={t('order_form.shipping_fee')}
        value={watchShippingPrice || 0}
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
        value={totalPrice}
        error={totalPrice < 0}
      />
    </Container.Scroll>
  );
}
