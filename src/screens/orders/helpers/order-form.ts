import { z } from 'zod';

export const orderFormSchema = z.object({
  order_code: z.string(),
  payment_method_type: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable(),
  payment_via: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable(),
  store_id: z.string(),
  location_id: z.string(),
  checkout_at: z.string(),
  sales_pic: z.string(),
  remarks: z.string(),
  origin_code: z.string(),
  destination_code: z.string(),
  cod_percentage: z.number().min(0),
  insurance_percentage: z.number().min(0),
  dropshipper_name: z.string(),
  dropshipper_phone: z.string().nullable(),
  dropshipper_email: z.string(),
  dropshipper_full_address: z.string(),
  is_dropship: z.boolean(),
  is_draft: z.boolean(),
  is_unpaid: z.boolean(),
  is_same_as_recipient: z.boolean(),
  recipient: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    country: z.string(),
    province: z.string(),
    city: z.string(),
    sub_district: z.string(),
    district: z.string(),
    postal_code: z.string(),
    full_address: z.string(),
    sub_district_id: z.string(),
    remarks: z.string(),
    recipient_sub_district_id: z.string(),
  }),
  buyer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    full_address: z.string(),
  }),
  delivery: z.object({
    logistic: z.string(),
    delivery_method: z.string(),
    logistic_provider_name: z.string(),
    logistic_service_name: z.string(),
    logistic_carrier: z.string(),
    tracking_number: z.string(),
  }),
  products: z.array(
    z.object({
      name: z.string(),
      sku: z.string(),
      product_id: z.number(),
      unit_price: z.number(),
      unit_weight: z.string(),
      qty: z.number(),
    }),
  ),
  package: z.object({
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }),
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
  }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
