/**
 * Delays execution for a specified number of milliseconds.
 * @param ms - The number of milliseconds to delay.
 * @returns Promise<void> - A promise that resolves after the delay.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Takes at least the specified duration, even if the promise resolves faster.
 * This is useful for showing a loading UI for a minimum amount of time.
 * @param durationMs - The number of milliseconds to delay.
 * @param fn - The function to execute.
 * @returns A function that takes the same arguments as the original function and returns a promise that resolves after the minimum duration.
 */
export function takeAtLeast<Args extends unknown[], R>(
  durationMs: number,
  fn: (...args: Args) => Promise<R>,
): (...args: Args) => Promise<R> {
  return async (...args: Args) => {
    const [result, _] = await Promise.all([fn(...args), delay(durationMs)]);

    return result;
  };
}
