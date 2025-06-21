import { z } from 'zod';

export const addEducationSchema = z
    .object({
        institute: z.string().min(2),
        degree: z.string().min(2),
        fieldOfStudy: z.string().optional(),
        startYear: z.number().int().gte(1900).lte(new Date().getFullYear()),
        endYear: z.number().int().gte(1900).lte(new Date().getFullYear()).optional(),
    })
    .refine(data => !data.endYear || data.endYear >= data.startYear, {
        message: 'endYear cannot be before startYear',
        path: ['endYear'],
    });
