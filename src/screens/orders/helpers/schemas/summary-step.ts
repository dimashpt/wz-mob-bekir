import { z } from 'zod';

export const summaryStepSchema = z.object({
  other_fee: z.number().optional(),
  order_discount: z.number().optional(),
});
