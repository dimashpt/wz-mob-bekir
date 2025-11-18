/**
 * Delays execution for a specified number of milliseconds.
 * @param ms - The number of milliseconds to delay.
 * @returns Promise<void> - A promise that resolves after the delay.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
