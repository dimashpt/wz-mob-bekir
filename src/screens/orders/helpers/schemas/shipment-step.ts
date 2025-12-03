import { z } from 'zod';

import { LogisticProvider } from '@/services/shipment';

export const shipmentStepSchema = z.object({
  is_self_delivery: z.boolean().optional(),
  logistic_name: z.string().optional(),
  logistic: z.object({
    value: z.string(),
    label: z.string(),
    data: z.custom<LogisticProvider>().optional(),
  }),
  delivery_method: z.string().optional(),
  logistic_provider_name: z.string().optional(),
  logistic_service_name: z.string().optional(),
  logistic_carrier: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_price: z.number(),
  is_using_insurance: z.boolean().optional(),
  shipping_discount: z.number().optional(),
  packing_fee: z.number().optional(),
  is_shipping_cost_covered_by_seller: z.boolean().optional(),
});
