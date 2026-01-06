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

/**
 * Formats a file size in bytes into a human-readable string.
 * @param bytes The file size in bytes (number or bigint).
 * @param decimals The number of decimal places to include (default is 2).
 * @returns A human-readable string, e.g., "10.24 MB".
 */
export function formatFileSize(bytes: number | bigint, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));

  // ToFixed() returns a string, so we use parseFloat to convert it back to a number,
  // which removes trailing zeros before adding the unit.
  return `${parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
