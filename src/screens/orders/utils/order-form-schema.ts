import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

import { Address } from '@/services/order';
import { LogisticProvider } from '@/services/shipment';
import { Warehouse } from '@/services/warehouse';
import {
  emailSchema,
  numberSchema,
  optionalEmailSchema,
  optionalNumberSchema,
  optionalPhoneSchema,
  optionalStringSchema,
  phoneSchema,
  required,
  stringSchema,
} from '@/utils/validation';

const baseRecipientStepSchema = z.object({
  customer: z.object({
    name: stringSchema,
    phone: phoneSchema,
    email: emailSchema,
    full_address: stringSchema,
  }),
  email: optionalEmailSchema,
  country: stringSchema,
  province: stringSchema,
  city: stringSchema,
  subdistrict: z.object(
    {
      value: stringSchema,
      label: stringSchema,
      data: z.custom<Address>().optional(),
    },
    { error: required },
  ),
  district: stringSchema,
  postal_code: stringSchema,
  remarks: optionalStringSchema,
});

const whenSameAsRecipientSchema = baseRecipientStepSchema.extend({
  is_same_as_customer: z.literal(true),
  name: optionalStringSchema,
  phone: optionalPhoneSchema,
  full_address: optionalStringSchema,
});

const whenNotSameAsRecipientSchema = baseRecipientStepSchema.extend({
  is_same_as_customer: z.literal(false),
  name: stringSchema,
  phone: phoneSchema,
  full_address: stringSchema,
});

const recipientStepSchema = z.discriminatedUnion('is_same_as_customer', [
  whenSameAsRecipientSchema,
  whenNotSameAsRecipientSchema,
]);

const orderStepSchema = z.object({
  order_code: stringSchema,
  payment_type: z.object(
    {
      value: stringSchema,
      label: stringSchema,
    },
    { error: required },
  ),
  payment_method: z.object(
    {
      value: stringSchema,
      label: stringSchema,
    },
    { error: required },
  ),
  store: z.object(
    {
      value: stringSchema,
      label: stringSchema,
    },
    { error: required },
  ),
  warehouse: z.object(
    {
      value: stringSchema,
      label: stringSchema,
      data: z.custom<Warehouse>(),
    },
    { error: required },
  ),
  checkout_time: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    error: required,
  }),
  sales: optionalStringSchema,
  remarks: optionalStringSchema,
});

const baseItemStepSchema = z.object({
  products: z
    .array(
      z.object({
        quantity: optionalNumberSchema,
        product_id: numberSchema,
        name: stringSchema,
        sku: stringSchema,
        brand: stringSchema.nullable(),
        category_name: stringSchema,
        featured_image_url: stringSchema.nullable(),
        weight: stringSchema,
        width: stringSchema,
        height: stringSchema,
        length: stringSchema,
        volume: numberSchema,
        is_bundle: z.boolean(),
        cost_price: stringSchema,
        published_price: stringSchema,
        status: stringSchema,
        created_at: stringSchema,
        created_by: stringSchema,
        updated_at: stringSchema,
        updated_by: stringSchema,
        mapping_count: numberSchema,
        available: numberSchema.nullable(),
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
  dropshipper_name: stringSchema,
  dropshipper_phone: phoneSchema,
  dropshipper_email: emailSchema,
  dropshipper_full_address: stringSchema,
});

const whenNotDropshipperSchema = baseItemStepSchema.extend({
  is_dropship: z.literal(false),
  dropshipper_name: optionalStringSchema,
  dropshipper_phone: optionalPhoneSchema,
  dropshipper_email: optionalEmailSchema,
  dropshipper_full_address: optionalStringSchema,
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
      value: stringSchema,
      label: stringSchema,
      data: z.custom<LogisticProvider>().optional(),
    },
    { error: required },
  ),
  logistic_name: optionalStringSchema,
  logistic_provider_name: optionalStringSchema,
  logistic_service_name: optionalStringSchema,
  logistic_carrier: optionalStringSchema,
  tracking_number: optionalStringSchema,
  shipping_fee: numberSchema,
  shipping_discount: z.coerce.number<number>().optional(),
  packing_fee: z.coerce.number<number>().optional(),
  other_fee: z.coerce.number<number>().optional(),
  order_discount: z.coerce.number<number>().optional(),
});

const summaryStepSchema = z.object({}).optional();

export const orderFormSchema = z.object({
  step_order: orderStepSchema,
  step_recipient: recipientStepSchema,
  step_item: itemStepSchema,
  step_shipment: shipmentStepSchema,
  step_summary: summaryStepSchema,
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
