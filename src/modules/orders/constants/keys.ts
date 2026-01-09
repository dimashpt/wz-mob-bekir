import { CustomerRequestParams } from '../services/customer/types';
import {
  AddressRequestParams,
  OrderHistoryParams,
  OrderRequestParams,
} from '../services/order';
import { ProductListRequestParams } from '../services/products/types';
import { LogisticProvidersParams } from '../services/shipment/types';
import { StoreListRequestParams } from '../services/store/types';
import { WarehouseListRequestParams } from '../services/warehouse/types';

export const orderKeys = {
  list: (params?: OrderRequestParams) => [
    'order-list',
    ...(params ? [params, 'infinite'] : []),
  ],
  create: ['store-create'],
  details: (id: string) => ['store-details', id],
  histories: (id: string, params: OrderHistoryParams) => [
    'store-histories',
    id,
    params,
  ],
  address: (params?: AddressRequestParams) =>
    ['store-address', params].filter(Boolean),
};

export const storeKeys = {
  list: (params: StoreListRequestParams) => ['store-list', params, 'infinite'],
};

export const warehouseKeys = {
  list: (params: WarehouseListRequestParams) => [
    'warehouse-list',
    params,
    'infinite',
  ],
};

export const productKeys = {
  list: (params: ProductListRequestParams) => [
    'product-list',
    params,
    'infinite',
  ],
};

export const shipmentKeys = {
  logistics: (params: LogisticProvidersParams) => [
    'shipment-logistics',
    params,
  ],
};

export const customerKeys = {
  list: (params: CustomerRequestParams) => ['customer-list', params],
};
