import { z } from 'zod';

import { Address } from '@/services/order';

const baseRecipientStepSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  sub_district: z.object({
    value: z.string(),
    label: z.string(),
    data: z.custom<Address>().optional(),
  }),
  district: z.string(),
  postal_code: z.string(),
  full_address: z.string(),
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

export const recipientStepSchema = z.discriminatedUnion(
  'is_same_as_recipient',
  [whenSameAsRecipientSchema, whenNotSameAsRecipientSchema],
);
