import { z } from 'zod';

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
    weight: z.coerce.number<number>(),
    length: z.coerce.number<number>().optional(),
    width: z.coerce.number<number>().optional(),
    height: z.coerce.number<number>().optional(),
  }),
});

const whenDropshipperSchema = baseItemStepSchema.extend({
  is_dropship: z.literal(true),
  dropshipper_name: z.string(),
  dropshipper_phone: z.string(),
  dropshipper_email: z.string(),
  dropshipper_full_address: z.string(),
});

const whenNotDropshipperSchema = baseItemStepSchema.extend({
  is_dropship: z.literal(false),
  dropshipper_name: z.string().optional(),
  dropshipper_phone: z.string().optional(),
  dropshipper_email: z.string().optional(),
  dropshipper_full_address: z.string().optional(),
});

export const itemStepSchema = z.discriminatedUnion('is_dropship', [
  whenDropshipperSchema,
  whenNotDropshipperSchema,
]);
