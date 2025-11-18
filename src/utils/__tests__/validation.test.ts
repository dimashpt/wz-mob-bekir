import { compareVersions } from '../validation';

describe('validation', () => {
  describe('compareVersions', () => {
    it('should return -1 when update is available (v1 < v2)', () => {
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('0.9.0', '1.0.0')).toBe(-1);
    });

    it('should return 1 when local version is newer (v1 > v2)', () => {
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.0.0', '0.9.0')).toBe(1);
    });

    it('should return 0 when versions are equal', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
      expect(compareVersions('2.5.10', '2.5.10')).toBe(0);
      expect(compareVersions('0.0.0', '0.0.0')).toBe(0);
    });

    it('should handle versions with different lengths', () => {
      expect(compareVersions('1.0', '1.0.0')).toBe(0);
      expect(compareVersions('1', '1.0.0')).toBe(0);
      expect(compareVersions('2.0', '1.9.9')).toBe(1);
    });

    it('should handle major version differences correctly', () => {
      expect(compareVersions('1.99.99', '2.0.0')).toBe(-1);
      expect(compareVersions('10.0.0', '9.99.99')).toBe(1);
    });
  });
});
