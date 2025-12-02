import { z } from 'zod';

export const shipmentStepSchema = z.object({
  delivery: z.object({
    is_self_delivery: z.boolean(),
    logistic_name: z.string().optional(),
    logistic: z.object({
      value: z.string(),
      label: z.string(),
    }),
    delivery_method: z.string().optional(),
    logistic_provider_name: z.string().optional(),
    logistic_service_name: z.string().optional(),
    logistic_carrier: z.string().optional(),
    tracking_number: z.string().optional(),
  }),
});
