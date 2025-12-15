import {
  CreateOrderPayload,
  OrderInternalStatus,
} from '../services/order/types';
import { OrderFormValues } from './order-form-schema';

export const statusToTranslationKey = (status: OrderInternalStatus): string => {
  return status
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Maps the form values to the order payload.
 * @param values - The form values to map to the order payload.
 * @returns The order payload.
 */
export const mapToOrderPayload = (
  values: OrderFormValues,
): CreateOrderPayload => {
  const { step_order, step_recipient, step_item, step_shipment } = values;

  return {
    order_code: step_order.order_code ?? '',
    payment_method_type: step_order.payment_type.value,
    payment_via: step_order.payment_method.value,
    store_id: step_order.store.value,
    location_id: step_order.warehouse.value,
    checkout_at: step_order.checkout_time.toISOString(),
    sales_pic: step_order.sales ?? '',
    remarks: step_order.remarks ?? '',
    origin_code: step_order.warehouse.data?.origin_code ?? '',
    destination_code: step_recipient.subdistrict.data?.subdistrict_code ?? '',
    cod_percentage: step_shipment.logistic.data?.cod_percentage ?? 0,
    insurance_percentage: 1,
    dropshipper_name: step_item.dropshipper_name ?? '',
    dropshipper_phone: step_item.dropshipper_phone ?? '',
    dropshipper_email: step_item.dropshipper_email ?? '',
    dropshipper_full_address: step_item.dropshipper_full_address ?? '',
    is_dropship: step_item.is_dropship,
    is_draft: false,
    is_unpaid: false,
    recipient: {
      name: step_recipient.is_same_as_customer
        ? step_recipient.customer.name?.label
        : (step_recipient.name ?? ''),
      phone: step_recipient.is_same_as_customer
        ? step_recipient.customer.phone
        : (step_recipient.phone ?? ''),
      email: step_recipient.is_same_as_customer
        ? (step_recipient?.customer?.email ?? '')
        : (step_recipient.email ?? ''),
      country: step_recipient.subdistrict.data?.country ?? '',
      province: step_recipient.subdistrict.data?.state ?? '',
      city: step_recipient.subdistrict.data?.city ?? '',
      sub_district: step_recipient.subdistrict.data?.subdistrict ?? '',
      district: step_recipient.district,
      postal_code: step_recipient.postal_code,
      full_address: step_recipient.is_same_as_customer
        ? step_recipient.customer.full_address
        : (step_recipient.full_address ?? ''),
      sub_district_id: step_recipient.subdistrict.data?.subdistrict ?? '',
      remarks: step_recipient.remarks ?? '',
      recipient_sub_district_id:
        step_recipient.subdistrict.data?.subdistrict_code ?? '',
    },
    buyer: {
      name: step_recipient.customer?.name?.label ?? '',
      phone: step_recipient.customer?.phone ?? '',
      email: step_recipient.customer?.email ?? '',
      full_address: step_recipient.customer?.full_address ?? '',
    },
    delivery: {
      logistic: step_shipment.logistic.data?.pattern ?? '',
      delivery_method: step_shipment.is_self_delivery
        ? 'SELF-DELIVERY'
        : 'SYSTEM-DELIVERY',
      logistic_provider_name: step_shipment.logistic.data?.provider_name ?? '',
      logistic_service_name: step_shipment.logistic.data?.service_type ?? '',
      logistic_carrier: step_shipment.logistic.data?.pattern ?? '',
      tracking_number: step_shipment.tracking_number ?? '',
    },
    products: step_item.products.map((product) => ({
      name: product.name,
      sku: product.sku,
      product_id: product.product_id,
      unit_price: Number(product.published_price),
      unit_weight: product.weight,
      qty: product.quantity ?? 1,
    })),
    package: {
      weight: step_item.package.weight,
      length: step_item.package.length ?? 0,
      width: step_item.package.width ?? 0,
      height: step_item.package.height ?? 0,
    },
    price: {
      shipping_price: step_shipment.shipping_fee,
      other_price: step_shipment.other_fee ?? 0,
      cod_fee: step_shipment.logistic.data?.cod_percentage ?? 0,
      discount_seller: step_shipment.order_discount ?? 0,
      discount_shipping: step_shipment.shipping_discount ?? 0,
      packing_price: step_shipment.packing_fee ?? 0,
      sub_total_price: 0,
      total_discount_price: 0,
      cod_price: 0,
      grand_total_order_price: 0,
      insurance_price: 0,
    },
  };
};
