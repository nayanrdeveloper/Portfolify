import { z } from 'zod';
import { MSG } from '../../core/messages';
import { isoDate } from '../../core/validators/date';

// Zod (authoritative)
export const createEducationSchema = z.object({
    institution: z.string().min(2, MSG.STRING_MIN('Institution', 2)),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startDate: isoDate,
    endDate: isoDate.nullable().optional(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();
