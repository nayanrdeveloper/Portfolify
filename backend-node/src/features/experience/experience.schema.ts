import { z } from 'zod';
import { MSG } from '../../core/messages';
import { isoDate } from '../../core/validators/date';

/* 1️⃣  base object (no effects yet) */
const baseExperienceSchema = z.object({
    title: z.string().min(2, MSG.STRING_MIN('Title', 2)),
    company: z.string().min(2, MSG.STRING_MIN('Company', 2)),
    location: z.string().optional(),
    startDate: isoDate,
    endDate: isoDate.nullable().optional(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().optional(),
});

/* 2️⃣  create  = base + refine */
export const createExperienceSchema = baseExperienceSchema.refine(
    d => !d.endDate || d.endDate >= d.startDate,
    { path: ['endDate'], message: 'endDate cannot be before startDate' },
);

/* 3️⃣  update  = partial(base) + same refine */
export const updateExperienceSchema = baseExperienceSchema
    .partial()
    .refine(d => !d.endDate || !d.startDate || d.endDate >= d.startDate, {
        path: ['endDate'],
        message: 'endDate cannot be before startDate',
    });
