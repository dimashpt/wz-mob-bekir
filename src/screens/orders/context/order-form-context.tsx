import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { OrderFormValues } from '../utils/order-form-schema';

interface OrderFormContextValue {
  subTotal: number;
  insuranceFee: number;
  codFee: number;
  totalDiscount: number;
  grandTotal: number;
}

const OrderFormContext = createContext<OrderFormContextValue | undefined>(
  undefined,
);

export function OrderFormProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { control, ...form } = useFormContext<OrderFormValues>();
  const watchShippingFee = useWatch({
    control,
    name: 'step_shipment.shipping_fee',
    exact: true,
  });
  const watchShippingDiscount = useWatch({
    control,
    name: 'step_shipment.shipping_discount',
    exact: true,
  });
  const watchOrderDiscount = useWatch({
    control,
    name: 'step_shipment.order_discount',
    exact: true,
  });
  const watchProducts = useWatch({
    control,
    name: 'step_item.products',
    exact: true,
  });
  const watchLogistics = useWatch({
    control,
    name: 'step_shipment.logistic',
    exact: true,
  });
  const watchPaymentMethod = useWatch({
    control,
    name: 'step_order.payment_type',
    exact: true,
  });
  const watchIsUsingInsurance = useWatch({
    control,
    name: 'step_shipment.is_using_insurance',
    exact: true,
  });
  const watchOtherFees = useWatch({
    control,
    name: 'step_shipment.other_fee',
    exact: true,
  });
  const watchPackingFee = useWatch({
    control,
    name: 'step_shipment.packing_fee',
    exact: true,
  });

  const watchWarehouse = useWatch({
    control,
    name: 'step_order.warehouse',
    exact: true,
  });

  const watchRecipientSubDistrict = useWatch({
    control,
    name: 'step_recipient.subdistrict',
    exact: true,
  });

  const watchSelfDelivery = useWatch({
    control,
    name: 'step_shipment.is_self_delivery',
    exact: true,
  });

  useEffect(() => {
    // Update package weight in the form
    form.setValue('step_item.package.weight', handleCalculateWeight());
  }, [watchProducts]);

  useEffect(() => {
    // Reset products when warehouse changes
    form.setValue('step_item.products', []);
  }, [watchWarehouse]);

  useEffect(() => {
    if (watchSelfDelivery) return;

    // Reset logistic when recipient subdistrict or warehouse changes
    form.resetField('step_shipment.logistic');
    form.resetField('step_shipment.logistic_name');
    form.resetField('step_shipment.logistic_provider_name');
    form.resetField('step_shipment.logistic_service_name');
    form.resetField('step_shipment.logistic_carrier');
  }, [watchRecipientSubDistrict, watchWarehouse, watchSelfDelivery]);

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
      const totalPrice =
        subTotal +
        Number(watchOtherFees || 0) -
        Number(watchOrderDiscount || 0);

      return (
        (totalPrice * (watchLogistics?.data?.insurance_percentage || 0)) / 100
      );
    }

    return 0;
  }, [
    watchLogistics,
    subTotal,
    watchIsUsingInsurance,
    watchOtherFees,
    watchOrderDiscount,
  ]);

  const codFee = useMemo(() => {
    if (
      watchPaymentMethod?.value === 'COD' &&
      watchLogistics?.data?.cod_percentage &&
      subTotal > 0
    ) {
      const priceTotal =
        subTotal +
        Number(watchShippingFee || 0) +
        Number(watchOtherFees || 0) -
        Number(watchOrderDiscount || 0);
      const codPercentage = watchLogistics?.data?.cod_percentage || 0;

      return Math.ceil((codPercentage / 100) * priceTotal);
    }
    return 0;
  }, [
    watchPaymentMethod,
    watchLogistics,
    subTotal,
    watchShippingFee,
    watchOtherFees,
    watchOrderDiscount,
  ]);

  const totalDiscount = useMemo(() => {
    return Number(watchShippingDiscount || 0) + Number(watchOrderDiscount || 0);
  }, [watchShippingDiscount, watchOrderDiscount]);

  const grandTotal = useMemo(() => {
    const total =
      subTotal +
      (Number(watchShippingFee) || 0) +
      (Number(watchOtherFees) || 0) +
      (Number(watchPackingFee) || 0) +
      insuranceFee +
      codFee -
      totalDiscount;
    return total;
  }, [
    subTotal,
    watchShippingFee,
    watchOtherFees,
    watchPackingFee,
    totalDiscount,
    codFee,
    insuranceFee,
  ]);

  const value: OrderFormContextValue = {
    subTotal,
    insuranceFee,
    codFee,
    totalDiscount,
    grandTotal,
  };

  const handleCalculateWeight = useCallback(() => {
    const totalWeight = watchProducts?.reduce((total, product) => {
      const productWeight = Number(product.weight) || 0;
      const quantity = product.quantity || 0;
      return total + productWeight * quantity;
    }, 0);

    return totalWeight || 0;
  }, [watchProducts]);

  return (
    <OrderFormContext.Provider value={value}>
      {children}
    </OrderFormContext.Provider>
  );
}

export function useOrderForm(): OrderFormContextValue {
  const context = useContext(OrderFormContext);
  if (context === undefined) {
    throw new Error('useOrderForm must be used within an OrderFormProvider');
  }
  return context;
}
