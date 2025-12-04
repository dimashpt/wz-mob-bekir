import { OrderInternalStatus } from '@/services/order/types';

export const statusToTranslationKey = (status: OrderInternalStatus): string => {
  return status
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};
