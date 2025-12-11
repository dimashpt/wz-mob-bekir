import { z } from 'zod';

import { i18n } from '@/lib/i18n';

// ============================================================================
// Error Messages
// ============================================================================

export const required = (_: z.core.$ZodRawIssue): string =>
  i18n.t('validation.required');

export const minimum = (iss: z.core.$ZodRawIssue): string =>
  i18n.t('validation.minimum', { minimum: iss.minimum });

export const startsWith = (iss: z.core.$ZodRawIssue): string =>
  i18n.t('validation.startsWith', { startsWith: iss.prefix });

export const email = (iss: z.core.$ZodRawIssue): string =>
  ['', undefined].includes(iss.input as string)
    ? i18n.t('validation.required')
    : i18n.t('validation.email');

// ============================================================================
// String Validation
// ============================================================================

const baseString = z.string({ error: required });

export const stringSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseString,
);

export const optionalStringSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseString.optional(),
);

// ============================================================================
// Number Validation
// ============================================================================

const baseNumber = z.number({ error: required });

export const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseNumber,
);

export const optionalNumberSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseNumber.optional(),
);

// ============================================================================
// Email Validation
// ============================================================================

const baseEmail = z.email({ error: email });

export const emailSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseEmail,
);

export const optionalEmailSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  baseEmail.optional(),
);

// ============================================================================
// Phone Validation
// ============================================================================

const basePhone = z
  .string({ error: required })
  .startsWith('+62', { error: startsWith })
  .min(10, { error: minimum });

export const phoneSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  basePhone,
);

export const optionalPhoneSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  basePhone.optional(),
);
