import dayjs from 'dayjs';
import { UseFormReset } from 'react-hook-form';

import {
  CreateOrderPayload,
  OrderDetails,
  OrderInternalStatus,
} from '../services/order/types';
import { OrderFormValues } from './order-form-schema';

export function statusToTranslationKey(status: OrderInternalStatus): string {
  return status
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Maps the form values to the order payload.
 * @param values - The form values to map to the order payload.
 * @returns The order payload.
 */
export function mapToOrderPayload(values: OrderFormValues): CreateOrderPayload {
  const { step_order, step_recipient, step_item, step_shipment } = values;

  return {
    order_code: step_order?.order_code ?? '',
    payment_method_type: step_order?.payment_type?.value ?? '',
    payment_via: step_order?.payment_method?.value ?? '',
    store_id: step_order?.store?.value ?? '',
    location_id: step_order?.warehouse?.value ?? '',
    checkout_at: step_order?.checkout_time?.toISOString() ?? '',
    sales_pic: step_order?.sales ?? '',
    remarks: step_order?.remarks ?? '',
    origin_code: step_order?.warehouse?.data?.origin_code ?? '',
    destination_code: step_recipient?.subdistrict?.data?.subdistrict_code ?? '',
    cod_percentage: step_shipment?.logistic?.data?.cod_percentage ?? 0,
    insurance_percentage: 1,
    dropshipper_name: step_item?.dropshipper_name ?? '',
    dropshipper_phone: step_item?.dropshipper_phone ?? '',
    dropshipper_email: step_item?.dropshipper_email ?? '',
    dropshipper_full_address: step_item?.dropshipper_full_address ?? '',
    is_dropship: step_item?.is_dropship ?? false,
    is_draft: false,
    is_unpaid: false,
    recipient: {
      name: step_recipient?.is_same_as_customer
        ? step_recipient.customer.name?.label
        : (step_recipient.name ?? ''),
      phone: step_recipient?.is_same_as_customer
        ? (step_recipient?.customer?.phone ?? '')
        : (step_recipient?.phone ?? ''),
      email: step_recipient?.is_same_as_customer
        ? (step_recipient?.customer?.email ?? '')
        : (step_recipient.email ?? ''),
      country: step_recipient?.subdistrict?.data?.country ?? '',
      province: step_recipient.subdistrict.data?.state ?? '',
      city: step_recipient?.subdistrict?.data?.city ?? '',
      sub_district: step_recipient?.subdistrict?.data?.subdistrict ?? '',
      district: step_recipient?.district ?? '',
      postal_code: step_recipient?.postal_code ?? '',
      full_address: step_recipient?.is_same_as_customer
        ? (step_recipient?.customer?.full_address ?? '')
        : (step_recipient?.full_address ?? ''),
      sub_district_id: step_recipient?.subdistrict?.data?.subdistrict ?? '',
      remarks: step_recipient?.remarks ?? '',
      recipient_sub_district_id:
        step_recipient?.subdistrict?.data?.subdistrict_code ?? '',
    },
    buyer: {
      name: step_recipient?.customer?.name?.label ?? '',
      phone: step_recipient?.customer?.phone ?? '',
      email: step_recipient?.customer?.email ?? '',
      full_address: step_recipient?.customer?.full_address ?? '',
    },
    delivery: {
      logistic: step_shipment?.logistic?.data?.pattern ?? '',
      delivery_method: step_shipment?.is_self_delivery
        ? 'SELF-DELIVERY'
        : 'SYSTEM-DELIVERY',
      logistic_provider_name:
        step_shipment?.logistic?.data?.provider_name ?? '',
      logistic_service_name: step_shipment?.logistic?.data?.service_type ?? '',
      logistic_carrier: step_shipment?.logistic?.data?.pattern ?? '',
      tracking_number: step_shipment?.tracking_number ?? '',
    },
    products:
      step_item?.products?.map((product) => ({
        name: product.name,
        sku: product.sku,
        product_id: product.product_id,
        unit_price: Number(product.published_price),
        unit_weight: product.weight,
        qty: product.quantity ?? 1,
      })) ?? [],
    package: {
      weight: step_item?.package?.weight ?? 0,
      length: step_item?.package?.length ?? 0,
      width: step_item?.package?.width ?? 0,
      height: step_item?.package?.height ?? 0,
    },
    price: {
      shipping_price: step_shipment?.shipping_fee ?? 0,
      other_price: step_shipment?.other_fee ?? 0,
      cod_fee: step_shipment?.logistic?.data?.cod_percentage ?? 0,
      discount_seller: step_shipment?.order_discount ?? 0,
      discount_shipping: step_shipment?.shipping_discount ?? 0,
      packing_price: step_shipment?.packing_fee ?? 0,
      sub_total_price: 0,
      total_discount_price: 0,
      cod_price: 0,
      grand_total_order_price: 0,
      insurance_price: 0,
    },
  };
}

/**
 * Maps the order details to the form values.
 * @param details - The order details to map to the form values.
 * @returns The form values.
 */
export function mapToOrderFormValues(
  details: OrderDetails,
): Parameters<UseFormReset<OrderFormValues>>[0] {
  type StepItemProduct = OrderFormValues['step_item']['products'][number];

  function mapToStepItemProduct(
    product: OrderDetails['active_products'][number],
  ): StepItemProduct {
    return {
      quantity: product.quantity,
      product_id: product.product_id,
      name: product.product_name,
      sku: product.sku,
      brand: null,
      category_name: '',
      featured_image_url: product.media_url ?? null,
      weight: product.unit_weight,
      width: '',
      height: '',
      length: '',
      volume: 0,
      is_bundle: false,
      cost_price: product.unit_price,
      published_price: product.unit_price,
      status: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: '',
      mapping_count: 0,
      available: null,
    };
  }

  const isSameAsCustomer: boolean =
    details.buyer_name === details.recipient_name &&
    (details.buyer_phone === details.recipient_phone ||
      details.buyer_email === details.recipient_email);

  const customer: OrderFormValues['step_recipient']['customer'] = {
    name: {
      // TODO: Map value to customer id
      value: details.buyer_name,
      label: details.buyer_name,
    },
    phone: details.buyer_phone ?? '',
    email: details.buyer_email ?? undefined,
    full_address: details.buyer_full_address ?? '',
  };

  const subdistrict: OrderFormValues['step_recipient']['subdistrict'] = {
    label: details.recipient_subdistrict ?? '',
    // TODO: Map value to subdistrict id
    value: details.recipient_subdistrict ?? '',
  };

  const packageSize: OrderFormValues['step_item']['package'] = {
    weight: Number(details.package_weight),
    length: Number(details.package_length),
    width: Number(details.package_width),
    height: Number(details.package_height),
  };

  const products: OrderFormValues['step_item']['products'] =
    details.active_products.map(mapToStepItemProduct);

  const step_recipient: OrderFormValues['step_recipient'] = isSameAsCustomer
    ? {
        customer,
        is_same_as_customer: true,
        name: details.recipient_name ?? undefined,
        phone: details.recipient_phone ?? undefined,
        email: details.recipient_email ?? undefined,
        subdistrict,
        country: details.recipient_country,
        province: details.recipient_province,
        city: details.recipient_city,
        district: details.recipient_district,
        postal_code: details.recipient_postal_code,
        full_address: details.recipient_full_address ?? undefined,
        remarks: details.recipient_remarks ?? undefined,
      }
    : {
        customer,
        is_same_as_customer: false,
        name: details.recipient_name,
        phone: details.recipient_phone,
        email: details.recipient_email ?? undefined,
        subdistrict,
        country: details.recipient_country,
        province: details.recipient_province,
        city: details.recipient_city,
        district: details.recipient_district,
        postal_code: details.recipient_postal_code,
        full_address: details.recipient_full_address,
        remarks: details.recipient_remarks ?? undefined,
      };

  const step_item: OrderFormValues['step_item'] = details.is_dropship
    ? {
        is_dropship: true,
        dropshipper_email: details.dropshipper_email ?? '',
        dropshipper_full_address: details.dropshipper_full_address ?? '',
        dropshipper_name: details.dropshipper_name ?? '',
        dropshipper_phone: details.dropshipper_phone ?? '',
        package: packageSize,
        products,
      }
    : {
        is_dropship: false,
        dropshipper_email: details.dropshipper_email ?? undefined,
        dropshipper_full_address: details.dropshipper_full_address ?? undefined,
        dropshipper_name: details.dropshipper_name ?? undefined,
        dropshipper_phone: details.dropshipper_phone ?? undefined,
        package: packageSize,
        products,
      };

  return {
    step_recipient,
    step_order: {
      order_code: details.order_code,
      payment_method: {
        value: details.payment_via,
        label: details.payment_via,
      },
      payment_type: {
        value: details.payment_method,
        label: details.payment_method,
      },
      store: {
        value: details.store_id.toString(),
        label: details.store_name,
      },
      warehouse: {
        value: details.location_id.toString(),
        label: details.location_name,
      },
      checkout_time: dayjs(details.checkout_at * 1000),
      sales: details.sales_pic ?? undefined,
      remarks: details.buyer_remarks ?? undefined,
    },
    step_item,
    step_shipment: {},
  };
}
