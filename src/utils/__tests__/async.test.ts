import { delay } from '../async';

describe('async utilities', () => {
  describe('delay', () => {
    it('should delay execution for specified milliseconds', async () => {
      const startTime = Date.now();
      const delayMs = 100;

      await delay(delayMs);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(delayMs);
    });

    it('should resolve after short delays', async () => {
      const delayMs = 10;
      const startTime = Date.now();

      await delay(delayMs);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(delayMs);
    });

    it('should return a resolved promise', async () => {
      const result = await delay(50);
      expect(result).toBeUndefined();
    });

    it('should be usable in async/await chains', async () => {
      const results: number[] = [];

      results.push(1);
      await delay(10);
      results.push(2);
      await delay(10);
      results.push(3);

      expect(results).toEqual([1, 2, 3]);
    });

    it('should handle zero milliseconds', async () => {
      const startTime = Date.now();
      await delay(0);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeGreaterThanOrEqual(0);
    });

    it('should handle large delay values', async () => {
      const delayMs = 200;
      const startTime = Date.now();

      await delay(delayMs);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(delayMs);
    });

    it('should work with Promise.all', async () => {
      const promises = [delay(50), delay(50), delay(50)];
      const startTime = Date.now();

      await Promise.all(promises);

      const elapsed = Date.now() - startTime;
      // All delays run in parallel, so elapsed should be ~50ms, not 150ms
      expect(elapsed).toBeGreaterThanOrEqual(50);
      expect(elapsed).toBeLessThan(150);
    });

    it('should work with Promise.race', async () => {
      const promises = [delay(10), delay(100), delay(200)];
      const startTime = Date.now();

      await Promise.race(promises);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(10);
      expect(elapsed).toBeLessThan(100);
    });
  });
});
