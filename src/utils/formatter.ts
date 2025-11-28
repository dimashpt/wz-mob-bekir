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

/**
 * Formats a number to a decimal string
 * @param value - The number to format
 * @returns The formatted number string
 */
export function formatNumber(
  value: number | string,
  minimumFractionDigits: number = 0,
): string {
  return Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits,
  }).format(Number(value));
}
