import React, { createContext, useContext, useMemo } from 'react';

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
  const { control } = useFormContext<OrderFormValues>();
  const watchShippingFee = useWatch({
    control,
    name: 'step_shipment.shipping_fee',
  });
  const watchShippingDiscount = useWatch({
    control,
    name: 'step_shipment.shipping_discount',
  });
  const watchOrderDiscount = useWatch({
    control,
    name: 'step_shipment.order_discount',
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
    name: 'step_order.payment_type',
  });
  const watchIsUsingInsurance = useWatch({
    control,
    name: 'step_shipment.is_using_insurance',
  });
  const watchOtherFees = useWatch({
    control,
    name: 'step_shipment.other_fee',
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
