import { z } from 'zod';

import { i18n } from '@/lib/i18n';

/**
 * Compares two version strings and returns a number indicating their relationship.
 * @param v1 - The first version string to compare.
 * @param v2 - The second version string to compare.
 * @returns A number indicating the relationship between the two versions:
 *          -1 if update is available,
 *           0 if local version is equal to store version,
 *           1 if local version is newer than store version.
 */
export function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const a = v1Parts[i] || 0;
    const b = v2Parts[i] || 0;

    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
}

/**
 * Returns a validation error message for a required field.
 * @param iss - The issue object from Zod
 * @returns The validation error message
 */
export function required(iss: z.core.$ZodRawIssue): string {
  return [undefined, ''].includes(iss.input as string)
    ? i18n.t('validation.required')
    : i18n.t('validation.invalid');
}
