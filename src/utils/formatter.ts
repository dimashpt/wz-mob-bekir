/**
 * Formats a number to a currency string
 * @param value - The number to format
 * @returns The formatted currency string
 */
export function formatCurrency(
  value: number | string,
  minimumFractionDigits: number = 0,
): string {
  return Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits,
  }).format(Number(value));
}
