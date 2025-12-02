import { z } from 'zod';

import { itemStepSchema } from './schemas/item-step';
import { orderStepSchema } from './schemas/order-step';
import { recipientStepSchema } from './schemas/recipient-step';
import { shipmentStepSchema } from './schemas/shipment-step';
import { summaryStepSchema } from './schemas/summary-step';

export { orderStepSchema } from './schemas/order-step';
export { recipientStepSchema } from './schemas/recipient-step';
export { itemStepSchema } from './schemas/item-step';
export { shipmentStepSchema } from './schemas/shipment-step';
export { summaryStepSchema } from './schemas/summary-step';

export const orderFormSchema = z.object({
  step_order: orderStepSchema,
  step_recipient: recipientStepSchema,
  step_item: itemStepSchema,
  step_shipment: shipmentStepSchema,
  step_summary: summaryStepSchema,
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
