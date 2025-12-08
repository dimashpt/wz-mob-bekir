import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { PriceCalculationsProvider } from '@/screens/orders/context/price-calculations-context';
import OrderForm from '@/screens/orders/order-form';
import {
  orderFormSchema,
  OrderFormValues,
} from '@/screens/orders/utils/order-form-schema';

export default function OrderFormRoute(): React.JSX.Element {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      step_recipient: {
        is_same_as_customer: false,
      },
      step_item: {
        is_dropship: false,
      },
    },
  });

  return (
    <FormProvider {...form}>
      <PriceCalculationsProvider>
        <OrderForm />
      </PriceCalculationsProvider>
    </FormProvider>
  );
}
