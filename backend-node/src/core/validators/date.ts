import { z } from 'zod';

/* YYYY-MM-DD (no time part) */
export const isoDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .transform(s => {
        const d = new Date(s + 'T00:00:00Z');
        if (isNaN(d.getTime())) throw new Error('Invalid date');
        return d;
    });

/* Full ISO timestamp with timezone or trailing Z */
export const isoDateTime = z
    .string()
    .refine(str => !isNaN(Date.parse(str)), { message: 'Invalid ISO date-time' })
    .transform(str => new Date(str));
