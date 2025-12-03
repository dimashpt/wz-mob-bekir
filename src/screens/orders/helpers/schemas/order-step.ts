import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

import { Warehouse } from '@/services/warehouse';

export const orderStepSchema = z.object({
  order_code: z.string().optional(),
  payment_type: z.object({
    value: z.string(),
    label: z.string(),
  }),
  payment_method: z.object({
    value: z.string(),
    label: z.string(),
  }),
  store: z.object({
    value: z.string(),
    label: z.string(),
  }),
  warehouse: z.object({
    value: z.string(),
    label: z.string(),
    data: z.custom<Warehouse>(),
  }),
  checkout_time: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid()),
  sales: z.string().optional(),
  remarks: z.string().optional(),
});
