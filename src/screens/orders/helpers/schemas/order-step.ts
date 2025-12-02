import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

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
  }),
  checkout_at: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid()),
  sales_pic: z.string(),
  remarks: z.string(),
  origin_code: z.string(),
  destination_code: z.string(),
  cod_percentage: z.number().min(0),
  insurance_percentage: z.number().min(0),
  is_draft: z.boolean(),
  is_unpaid: z.boolean(),
});
