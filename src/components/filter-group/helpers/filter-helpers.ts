import { Option } from '@/components/option-bottom-sheet';

export function getSelectedOption(
  options: Option[],
  value: string | string[] | undefined,
): Option | null {
  if (!value || Array.isArray(value)) return null;
  return options.find((opt) => opt.value === value) || null;
}

export function getSelectedOptions(
  options: Option[],
  value: string | string[] | undefined,
): Option[] {
  if (!Array.isArray(value)) return [];
  return options.filter((opt) => value.includes(opt.value));
}
