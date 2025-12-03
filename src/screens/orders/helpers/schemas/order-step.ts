import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

import { Warehouse } from '@/services/warehouse';

export const orderStepSchema = z.object({
  order_code: z.string().optional(),
  payment_method_type: z.object({
    value: z.string(),
    label: z.string(),
  }),
  payment_via: z.object({
    value: z.string(),
    label: z.string(),
  }),
  store_id: z.object({
    value: z.string(),
    label: z.string(),
  }),
  location_id: z.object({
    value: z.string(),
    label: z.string(),
    data: z.custom<Warehouse>(),
  }),
  checkout_at: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid()),
  sales_pic: z.string().optional(),
  remarks: z.string().optional(),
});
