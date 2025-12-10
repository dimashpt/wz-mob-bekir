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
export function required(_: z.core.$ZodRawIssue): string {
  return i18n.t('validation.required');
}

/**
 * Returns a validation error message for a minimum length field.
 * @param iss - The issue object from Zod
 * @returns The validation error message
 */
export function minimum(iss: z.core.$ZodRawIssue): string {
  return i18n.t('validation.minimum', { minimum: iss.minimum });
}

/**
 * Returns a validation error message for a starts with string.
 * @param iss - The issue object from Zod
 * @returns The validation error message
 */
export function startsWith(iss: z.core.$ZodRawIssue): string {
  return i18n.t('validation.startsWith', { startsWith: iss.prefix });
}

/**
 * Returns a validation error message for email format.
 * @param iss - The issue object from Zod
 * @returns The validation error message
 */
export function email(iss: z.core.$ZodRawIssue): string {
  return ['', undefined].includes(iss.input as string)
    ? i18n.t('validation.required')
    : i18n.t('validation.email');
}

const baseStringSchema = z.string({ error: required });

export const stringSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseStringSchema,
);

export const optionalStringSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseStringSchema.optional(),
);

const baseNumberSchema = z.number({ error: required });

export const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseNumberSchema,
);

export const optionalNumberSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseNumberSchema.optional(),
);

const baseEmailSchema = z.email({ error: email });

export const emailSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseEmailSchema,
);
export const optionalEmailSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseEmailSchema.optional(),
);

const basePhoneSchema = z
  .string({ error: required })
  .startsWith('+62', { error: startsWith })
  .min(10, { error: minimum });

export const phoneSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  basePhoneSchema,
);

export const optionalPhoneSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  basePhoneSchema.optional(),
);
