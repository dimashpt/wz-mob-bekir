import { Option } from '@/components/option-bottom-sheet';

/**
 * Converts an array of strings to an array of options.
 * @param array - The array of strings to convert.
 * @returns An array of options with the label and value set to the string.
 * @example
 * stringsToOptions(['apple', 'banana']) // [{ label: 'apple', value: 'apple' }, { label: 'banana', value: 'banana' }]
 */
export function stringsToOptions(array: string[]): Option[] {
  return array.map((item) => ({
    label: item,
    value: item,
  }));
}

/**
 * Turns an object into formdata for submission.
 * @param obj - The object to convert to FormData.
 * @returns A FormData object containing the key-value pairs from the object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}
