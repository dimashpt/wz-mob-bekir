import dayjs, { Dayjs } from 'dayjs';
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
  dropshipper_name: z.string(),
  dropshipper_phone: z.string(),
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
    sub_district: z.object({
      value: z.string(),
      label: z.string(),
    }),
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
    is_self_delivery: z.boolean(),
    logistic_name: z.string(),
    logistic: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable(),
    delivery_method: z.string(),
    logistic_provider_name: z.string(),
    logistic_service_name: z.string(),
    logistic_carrier: z.string(),
    tracking_number: z.string(),
  }),
  products: z.array(
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
  ),
  package: z.object({
    weight: z.coerce.number<number>(),
    length: z.coerce.number<number>(),
    width: z.coerce.number<number>(),
    height: z.coerce.number<number>(),
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
    is_shipping_cost_covered_by_seller: z.boolean(),
    is_using_insurance: z.boolean(),
  }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
