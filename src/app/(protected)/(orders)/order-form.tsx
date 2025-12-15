import { zodResolver } from '@hookform/resolvers/zod';
import * as Crypto from 'expo-crypto';
import { FormProvider, Resolver, useForm } from 'react-hook-form';

import { OrderFormProvider } from '@/modules/orders/context/order-form-context';
import OrderForm from '@/modules/orders/screens/order-form';
import {
  orderFormSchema,
  OrderFormValues,
} from '@/modules/orders/utils/order-form-schema';

export default function OrderFormRoute(): React.JSX.Element {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema) as Resolver<OrderFormValues>,
    mode: 'onChange',
    defaultValues: {
      step_recipient: {
        is_same_as_customer: false,
      },
      step_order: {
        order_code: generateOrderNumber(),
      },
      step_item: {
        is_dropship: false,
      },
    },
  });

  function generateOrderNumber(): string {
    const random = Crypto.randomUUID()
      .replace(/-/g, '')
      .substring(0, 12)
      .toUpperCase();
    return `ORD${random}`;
  }

  return (
    <FormProvider {...form}>
      <OrderFormProvider>
        <OrderForm />
      </OrderFormProvider>
    </FormProvider>
  );
}
