import { OrderInternalStatus } from '@/services/order';

export const ORDER_INTERNAL_STATUS: Record<
  OrderInternalStatus,
  OrderInternalStatus
> = {
  // Draft
  Unpaid: 'Unpaid',
  Draft: 'Draft',

  // Fulfillment
  'To Process': 'To Process',
  'In Process': 'In Process',
  'Ready To Print': 'Ready To Print',
  Packed: 'Packed',

  // Shipping
  'Ready For Pickup': 'Ready For Pickup',
  'Shipped Order': 'Shipped Order',
  'Shipping Completed Order': 'Shipping Completed Order',

  // Completed
  'Completed Order': 'Completed Order',
  'In Return': 'In Return',
  'Return Order': 'Return Order',

  // Problems
  'Out Of Stock': 'Out Of Stock',
  'Unmapping Product': 'Unmapping Product',
  'Unmapping Location': 'Unmapping Location',
  'Unmapping Delivery': 'Unmapping Delivery',
  'Undefined Status': 'Undefined Status',

  // Cancelation
  'In Cancel': 'In Cancel',
  'Cancelled Order': 'Cancelled Order',
};
