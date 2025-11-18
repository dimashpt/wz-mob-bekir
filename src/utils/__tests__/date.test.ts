import dayjs from 'dayjs';

import {
  formatDisplayDate,
  formatSmartDateRange,
  parseEnglishDate,
} from '../date';

describe('date utilities', () => {
  describe('formatDisplayDate', () => {
    it('should return dash for invalid date', () => {
      const result = formatDisplayDate('invalid-date');
      expect(result).toBe('-');
    });

    it('should format as absolute date when absoluteDate is true', () => {
      const date = '2024-01-15 14:30:00';
      const result = formatDisplayDate(date, true);
      expect(result).toMatch(/\d+ \w+ \d+ \d+:\d+/);
    });

    it('should format as relative date when absoluteDate is false', () => {
      const pastDate = dayjs()
        .subtract(2, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      const result = formatDisplayDate(pastDate, false);
      expect(result).toContain('ago');
    });

    it('should default to absolute format when absoluteDate is not specified', () => {
      const date = '2024-01-15 14:30:00';
      const result = formatDisplayDate(date);
      expect(result).toMatch(/\d+ \w+ \d+ \d+:\d+/);
    });

    it('should accept Date object', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDisplayDate(date, true);
      expect(result).toMatch(/\d+ \w+ \d+ \d+:\d+/);
    });

    it('should accept dayjs object', () => {
      const date = dayjs('2024-01-15 14:30:00');
      const result = formatDisplayDate(date, true);
      expect(result).toMatch(/\d+ \w+ \d+ \d+:\d+/);
    });

    it('should handle null/undefined gracefully', () => {
      // @ts-ignore - testing edge case
      const result = formatDisplayDate(null);
      expect(result).toBe('-');
    });

    it('should format relative time correctly for various time ranges', () => {
      const now = dayjs();
      const yesterday = now.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      const weekAgo = now.subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss');
      const monthAgo = now.subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss');

      const yesterdayResult = formatDisplayDate(yesterday, false);
      const weekResult = formatDisplayDate(weekAgo, false);
      const monthResult = formatDisplayDate(monthAgo, false);

      expect(yesterdayResult).toContain('ago');
      expect(weekResult).toContain('ago');
      expect(monthResult).toContain('ago');
    });
  });

  describe('formatSmartDateRange', () => {
    it('should return "Invalid date range" for invalid dates', () => {
      const result = formatSmartDateRange(['invalid', 'also-invalid']);
      expect(result).toBe('Invalid date range');
    });

    it('should return invalid date range when start date is invalid', () => {
      const result = formatSmartDateRange(['invalid', '2024-01-15']);
      expect(result).toBe('Invalid date range');
    });

    it('should return invalid date range when end date is invalid', () => {
      const result = formatSmartDateRange(['2024-01-15', 'invalid']);
      expect(result).toBe('Invalid date range');
    });

    it('should format same day with long format', () => {
      const result = formatSmartDateRange(['2024-01-15', '2024-01-15'], 'long');
      expect(result).toMatch(/\d+ \w+ \d+/);
      expect(result).not.toContain('-');
    });

    it('should format same day with short format', () => {
      const result = formatSmartDateRange(
        ['2024-01-15', '2024-01-15'],
        'short',
      );
      expect(result).toMatch(/\d+ \w+ \d+/);
    });

    it('should format same month with different days (long)', () => {
      const result = formatSmartDateRange(['2024-01-15', '2024-01-20'], 'long');
      expect(result).toMatch(/\d+-\d+/);
      expect(result).toContain('January');
    });

    it('should format same month with different days (short)', () => {
      const result = formatSmartDateRange(
        ['2024-01-15', '2024-01-20'],
        'short',
      );
      expect(result).toMatch(/\d+-\d+/);
    });

    it('should format different months (long)', () => {
      const result = formatSmartDateRange(['2024-01-15', '2024-02-20'], 'long');
      expect(result).toContain('January');
      expect(result).toContain('February');
      expect(result).toContain('-');
    });

    it('should format different months (short)', () => {
      const result = formatSmartDateRange(
        ['2024-01-15', '2024-02-20'],
        'short',
      );
      expect(result).toContain('-');
    });

    it('should accept Date objects', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      const result = formatSmartDateRange([startDate, endDate], 'long');

      expect(result).toContain('-');
      expect(result).toContain('January');
    });

    it('should accept dayjs objects', () => {
      const startDate = dayjs('2024-01-15');
      const endDate = dayjs('2024-01-20');
      const result = formatSmartDateRange([startDate, endDate], 'long');

      expect(result).toContain('-');
      expect(result).toContain('January');
    });

    it('should default to long format', () => {
      const result = formatSmartDateRange(['2024-01-15', '2024-01-20']);
      expect(result).toContain('January');
    });

    it('should handle year boundaries correctly', () => {
      const result = formatSmartDateRange(['2023-12-25', '2024-01-10']);
      expect(result).toContain('-');
      // The function displays both years only when explicitly in the format
      expect(result).toContain('2024');
      expect(result).toMatch(/December|January/);
    });
  });

  describe('parseEnglishDate', () => {
    it('should parse English date format correctly', () => {
      const dateString = '03 December 2025';
      const result = parseEnglishDate(dateString, 'DD MMMM YYYY');

      expect(result.isValid()).toBe(true);
      expect(result.date()).toBe(3);
      expect(result.month()).toBe(11); // December is month 11 (0-indexed)
      expect(result.year()).toBe(2025);
    });

    it('should handle different date formats', () => {
      const result = parseEnglishDate('Dec 03 2025', 'MMM DD YYYY');

      expect(result.isValid()).toBe(true);
      expect(result.date()).toBe(3);
      expect(result.month()).toBe(11);
      expect(result.year()).toBe(2025);
    });

    it('should return a valid dayjs object', () => {
      const result = parseEnglishDate('15 January 2024', 'DD MMMM YYYY');

      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-15');
    });

    it('should parse dates from various months', () => {
      const months = [
        { english: 'January', month: 0 },
        { english: 'February', month: 1 },
        { english: 'December', month: 11 },
      ];

      months.forEach(({ english, month }) => {
        const result = parseEnglishDate(`15 ${english} 2024`, 'DD MMMM YYYY');
        expect(result.month()).toBe(month);
      });
    });

    it('should handle short month names', () => {
      const result = parseEnglishDate('15 Jan 2024', 'DD MMM YYYY');

      expect(result.isValid()).toBe(true);
      expect(result.month()).toBe(0); // January
    });

    it('should parse time component if included in format', () => {
      const result = parseEnglishDate(
        '15 January 2024 14:30',
        'DD MMMM YYYY HH:mm',
      );

      expect(result.isValid()).toBe(true);
      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(30);
    });

    it('should handle invalid date strings', () => {
      const result = parseEnglishDate('invalid date', 'DD MMMM YYYY');
      expect(result.isValid()).toBe(false);
    });

    it('should handle leap year dates', () => {
      const result = parseEnglishDate('29 February 2024', 'DD MMMM YYYY');

      expect(result.isValid()).toBe(true);
      expect(result.date()).toBe(29);
    });

    it('should return dayjs object that can be formatted', () => {
      const result = parseEnglishDate('03 December 2025', 'DD MMMM YYYY');
      const formatted = result.format('YYYY-MM-DD');

      expect(formatted).toBe('2025-12-03');
    });

    it('should handle date boundaries (1st and 31st)', () => {
      const first = parseEnglishDate('01 January 2024', 'DD MMMM YYYY');
      const last = parseEnglishDate('31 December 2024', 'DD MMMM YYYY');

      expect(first.date()).toBe(1);
      expect(last.date()).toBe(31);
    });
  });
});
