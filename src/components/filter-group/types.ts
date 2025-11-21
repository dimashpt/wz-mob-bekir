import { Dayjs } from 'dayjs';

import { Option } from '@/components/option-bottom-sheet';

export interface BaseFilter {
  name: string;
  label: string;
}

export interface ToggleFilter extends BaseFilter {
  type?: 'toggle';
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export interface OptionFilter extends BaseFilter {
  type: 'options';
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
}

export interface DateFilter extends BaseFilter {
  type: 'date';
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  disabledDate?: (date: Dayjs) => boolean;
}

export interface DateRangeFilter extends BaseFilter {
  type: 'date-range';
  value?: { start: Dayjs; end: Dayjs } | null;
  onChange?: (value: { start: Dayjs; end: Dayjs } | null) => void;
  disabledDate?: (date: Dayjs) => boolean;
}

export type Filter = ToggleFilter | OptionFilter | DateFilter | DateRangeFilter;

export interface FilterGroupProps {
  filters: Filter[];
  scrollViewProps?: import('react-native').ScrollViewProps;
  hideClearAll?: boolean;
}
