import { z } from 'zod';
import { MSG } from '../../core/messages';
import { isoDate } from '../../core/validators/date';

/* 1️⃣  start with a *plain* object (no refine yet) */
const baseObject = z.object({
    name: z.string().min(2, MSG.STRING_MIN('Name', 2)),
    issuer: z.string().min(2, MSG.STRING_MIN('Issuer', 2)),
    issueDate: isoDate,
    expirationDate: isoDate.nullable().optional(),
    credentialID: z.string().optional(),
    credentialURL: z.string().url().optional(),
    description: z.string().optional(),
});

/* shared refinement rule */
const dateRule = (d: { issueDate?: Date; expirationDate?: Date | null }) =>
    !d.expirationDate || !d.issueDate || d.expirationDate >= d.issueDate;

/* 2️⃣  create-schema = object + refine */
export const createAchievementSchema = baseObject.refine(dateRule, {
    path: ['expirationDate'],
    message: 'expirationDate cannot be before issueDate',
});

/* 3️⃣  update-schema = partial(object) + same refine */
export const updateAchievementSchema = baseObject
    .partial()
    .refine(dateRule, {
        path: ['expirationDate'],
        message: 'expirationDate cannot be before issueDate',
    });
