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
  value?: Dayjs | null | { start: Dayjs; end: Dayjs };
  onChange?: (value: Dayjs | null | { start: Dayjs; end: Dayjs }) => void;
  mode?: 'calendar' | 'calendar-range' | 'wheel' | 'time';
  disabledDate?: (date: Dayjs) => boolean;
}

export type Filter = ToggleFilter | OptionFilter | DateFilter;

export interface FilterGroupProps {
  filters: Filter[];
  scrollViewProps?: import('react-native').ScrollViewProps;
  hideClearAll?: boolean;
}
