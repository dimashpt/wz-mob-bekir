/**
 * Orders Module API Endpoints
 * Includes endpoints for orders, products, shipment, store, and warehouse services
 */
export const orderEndpoints = {
  list: '/tenant/orders',
  create: '/tenant/orders',
  details: '/tenant/orders/:id',
  detailHistory: '/tenant/orders/:id/order-histories',
  address: '/tenant/region/destinations/search',
} as const;

export const storeEndpoints = {
  list: '/tenant/store',
} as const;

export const warehouseEndpoints = {
  list: '/tenant/location',
} as const;

export const productEndpoints = {
  list: '/tenant/products',
} as const;

export const shipmentEndpoints = {
  logistics: '/tenant/settings/logistics',
} as const;

export const customerEndpoints = {
  list: '/tenant/customers',
} as const;
