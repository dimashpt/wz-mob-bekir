export interface LogisticProvidersParams {
  origin_code: string;
  destination_code: string;
  weight: number;
}

export type LogisticProvidersResponse = LogisticProvider[];

export interface LogisticProvider {
  pattern: string;
  provider_code: string;
  provider_name: string;
  service_type: string;
  discount_percentage: number;
  cod_percentage: number;
  insurance_percentage: number;
  return_percentage: number;
  handling_percentage: number;
  is_default: boolean;
  is_active: boolean;
  price: null;
}
