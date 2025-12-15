/**
 * Orders Module API Endpoints
 * Includes endpoints for orders, products, shipment, store, and warehouse services
 */
export const ORDER_ENDPOINTS = {
  LIST_ORDERS: '/tenant/orders',
  CREATE_ORDER: '/tenant/orders',
  GET_ORDER_DETAILS: '/tenant/orders/:id',
  GET_ORDER_HISTORIES: '/tenant/orders/:id/order-histories',
  GET_ORDER_HISTORY_DETAILS: '/tenant/orders/:id/order-histories',
  GET_ADDRESS: '/tenant/region/destinations/search',
} as const;

export const STORE_ENDPOINTS = {
  LIST_STORES: '/tenant/store',
} as const;

export const WAREHOUSE_ENDPOINTS = {
  LIST_WAREHOUSES: '/tenant/location',
} as const;

export const PRODUCT_ENDPOINTS = {
  LIST_PRODUCTS: '/tenant/products',
} as const;

export const SHIPMENT_ENDPOINTS = {
  LIST_LOGISTICS: '/tenant/settings/logistics',
} as const;
