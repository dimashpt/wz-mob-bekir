import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

import { Address } from '@/services/order';
import { LogisticProvider } from '@/services/shipment';
import { Warehouse } from '@/services/warehouse';
import { required } from '@/utils/validation';

const orderStepSchema = z.object({
  order_code: z.string().optional(),
  payment_type: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { error: required },
  ),
  payment_method: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { error: required },
  ),
  store: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { error: required },
  ),
  warehouse: z.object(
    {
      value: z.string(),
      label: z.string(),
      data: z.custom<Warehouse>(),
    },
    { error: required },
  ),
  checkout_time: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    error: required,
  }),
  sales: z.string().optional(),
  remarks: z.string().optional(),
});

const baseRecipientStepSchema = z.object({
  name: z.string({ error: required }),
  phone: z.string({ error: required }),
  email: z.string({ error: required }).optional(),
  country: z.string({ error: required }),
  province: z.string({ error: required }),
  city: z.string({ error: required }),
  subdistrict: z.object(
    {
      value: z.string(),
      label: z.string(),
      data: z.custom<Address>().optional(),
    },
    { error: required },
  ),
  district: z.string({ error: required }),
  postal_code: z.string({ error: required }),
  full_address: z.string({ error: required }),
  remarks: z.string().optional(),
});

const whenSameAsRecipientSchema = baseRecipientStepSchema.extend({
  is_same_as_recipient: z.literal(false),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    full_address: z.string(),
  }),
});

const whenNotSameAsRecipientSchema = baseRecipientStepSchema.extend({
  is_same_as_recipient: z.literal(true),
  customer: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    full_address: z.string().optional(),
  }),
});

const recipientStepSchema = z.discriminatedUnion('is_same_as_recipient', [
  whenSameAsRecipientSchema,
  whenNotSameAsRecipientSchema,
]);

const baseItemStepSchema = z.object({
  products: z
    .array(
      z.object({
        quantity: z.number().optional(),
        product_id: z.number(),
        name: z.string(),
        sku: z.string(),
        brand: z.string().nullable(),
        category_name: z.string(),
        featured_image_url: z.string().nullable(),
        weight: z.string(),
        width: z.string(),
        height: z.string(),
        length: z.string(),
        volume: z.number(),
        is_bundle: z.boolean(),
        cost_price: z.string(),
        published_price: z.string(),
        status: z.string(),
        created_at: z.string(),
        created_by: z.string(),
        updated_at: z.string(),
        updated_by: z.string(),
        mapping_count: z.number(),
        available: z.number().nullable(),
      }),
    )
    .min(1),
  package: z.object({
    weight: z.coerce.number<number>({ error: required }),
    length: z.coerce.number<number>({ error: required }).optional(),
    width: z.coerce.number<number>({ error: required }).optional(),
    height: z.coerce.number<number>({ error: required }).optional(),
  }),
});

const whenDropshipperSchema = baseItemStepSchema.extend({
  is_dropship: z.literal(true),
  dropshipper_name: z.string({ error: required }),
  dropshipper_phone: z.string({ error: required }),
  dropshipper_email: z.string({ error: required }),
  dropshipper_full_address: z.string({ error: required }),
});

const whenNotDropshipperSchema = baseItemStepSchema.extend({
  is_dropship: z.literal(false),
  dropshipper_name: z.string().optional(),
  dropshipper_phone: z.string().optional(),
  dropshipper_email: z.string().optional(),
  dropshipper_full_address: z.string().optional(),
});

const itemStepSchema = z.discriminatedUnion('is_dropship', [
  whenDropshipperSchema,
  whenNotDropshipperSchema,
]);

const shipmentStepSchema = z.object({
  is_self_delivery: z.boolean().optional(),
  is_using_insurance: z.boolean().optional(),
  logistic: z.object(
    {
      value: z.string(),
      label: z.string(),
      data: z.custom<LogisticProvider>().optional(),
    },
    { error: required },
  ),
  logistic_name: z.string().optional(),
  logistic_provider_name: z.string().optional(),
  logistic_service_name: z.string().optional(),
  logistic_carrier: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_fee: z.number({ error: required }),
  shipping_discount: z.coerce.number<number>().optional(),
  packing_fee: z.coerce.number<number>().optional(),
});

const summaryStepSchema = z.object({
  other_fee: z.coerce.number<number>().optional(),
  order_discount: z.coerce.number<number>().optional(),
});

export const orderFormSchema = z.object({
  step_order: orderStepSchema,
  step_recipient: recipientStepSchema,
  step_item: itemStepSchema,
  step_shipment: shipmentStepSchema,
  step_summary: summaryStepSchema,
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
