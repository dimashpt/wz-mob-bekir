import { z } from 'zod';

export const summaryStepSchema = z.object({
  price: z.object({
    sub_total_price: z.number(),
    shipping_price: z.number(),
    other_price: z.number(),
    total_discount_price: z.number(),
    cod_fee: z.number(),
    cod_price: z.number(),
    grand_total_order_price: z.number(),
    discount_seller: z.number(),
    discount_shipping: z.number(),
    packing_price: z.number(),
    insurance_price: z.number(),
    is_shipping_cost_covered_by_seller: z.boolean(),
    is_using_insurance: z.boolean(),
  }),
});
