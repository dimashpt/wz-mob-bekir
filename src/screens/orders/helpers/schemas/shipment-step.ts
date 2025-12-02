import { z } from 'zod';

export const shipmentStepSchema = z.object({
  delivery: z.object({
    is_self_delivery: z.boolean(),
    logistic_name: z.string(),
    logistic: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable(),
    delivery_method: z.string(),
    logistic_provider_name: z.string(),
    logistic_service_name: z.string(),
    logistic_carrier: z.string(),
    tracking_number: z.string(),
  }),
});
