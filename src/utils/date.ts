import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// Load all supported languages
require('dayjs/locale/en');
require('dayjs/locale/id');

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * Formats a date for display with smart relative/absolute formatting
 * @param date - The date to format (string, Date, or dayjs object)
 * @param absoluteDate - If true, shows absolute format "D MMMM YYYY HH:mm"
 * @returns Formatted date string
 *
 * @example
 * // Yesterday
 * formatDisplayDate('2024-01-14 14:30:00') // "yesterday"
 *
 * // Relative dates
 * formatDisplayDate('2024-01-10 14:30:00') // "5 days ago"
 * formatDisplayDate('2023-12-15 14:30:00') // "1 month ago"
 * formatDisplayDate('2022-01-15 14:30:00') // "2 years ago"
 *
 * // Absolute format
 * formatDisplayDate('2024-01-15 14:30:00', true) // "15 January 2024 14:30"
 */
export function formatDisplayDate(
  date: string | Date | dayjs.Dayjs,
  absoluteDate: boolean = true,
): string {
  const targetDate = dayjs(date);

  // Validate the date
  if (!targetDate.isValid()) {
    return '-';
  }

  // If absoluteDate is true, return formatted absolute date
  if (absoluteDate) {
    return targetDate.format('D MMMM YYYY HH:mm');
  }

  // For other dates, use relative time
  return targetDate.fromNow();
}

/**
 * Formats a date range for display with smart formatting based on date proximity
 * @param dates - Array containing start and end dates [start, end]
 * @returns Formatted date range string
 *
 * @example
 * // Same day
 * formatSmartDateRange(['2024-01-15', '2024-01-15']) // "15 January 2024"
 *
 * // Same month
 * formatSmartDateRange(['2024-01-15', '2024-01-20']) // "15-20 January 2024"
 *
 * // Different months
 * formatSmartDateRange(['2024-01-15', '2024-02-20']) // "15 January - 20 February 2024"
 */
export function formatSmartDateRange(
  dates: [string | Date | dayjs.Dayjs, string | Date | dayjs.Dayjs],
  length: 'short' | 'long' = 'long',
): string {
  const [startDate, endDate] = dates;
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return 'Invalid date range';
  }

  // If start and end dates are the same day
  if (start.isSame(end, 'day')) {
    return start.format(length === 'short' ? 'D MMM YYYY' : 'D MMMM YYYY');
  }

  // If start and end dates are in the same month
  if (start.format('MMM') === end.format('MMM')) {
    return `${start.format('D')}-${end.format('D')} ${start.format(length === 'short' ? 'MMM YYYY' : 'MMMM YYYY')}`;
  }

  // If start and end dates are in different months
  return `${start.format(length === 'short' ? 'D MMM' : 'D MMMM')} - ${end.format(length === 'short' ? 'D MMM YYYY' : 'D MMMM YYYY')}`;
}

/**
 * Parses a date string in English format and returns a dayjs object in the current locale
 * This is useful when the API returns dates in English format but we want to display them in the user's language
 * @param dateString - Date string in English format (e.g., "03 December 2025")
 * @param format - The format of the input date string (e.g., "DD MMMM YYYY")
 * @returns dayjs object with proper locale support
 *
 * @example
 * // Parse English date and format in user's locale
 * parseEnglishDate("03 December 2025", "DD MMMM YYYY").format("DD MMMM YYYY")
 * // Returns "03 Desember 2025" if user's locale is 'id'
 */
export function parseEnglishDate(
  dateString: string,
  format: string,
): dayjs.Dayjs {
  // First parse the date using English locale to ensure correct parsing
  const parsedDate = dayjs(dateString, format, 'en');

  // Then create a new dayjs object with the current locale
  // This preserves the date value but allows formatting in the current locale
  return dayjs(parsedDate.toDate());
}
