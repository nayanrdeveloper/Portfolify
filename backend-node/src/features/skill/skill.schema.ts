import { z } from 'zod';
import { MSG } from '../../core/messages';

const base = z.object({
    name: z.string().min(2, MSG.STRING_MIN('Skill name', 2)),
    proficiency: z.string().optional(),
    years: z.number().min(0).optional(),
    iconName: z.string().optional(),
    iconURL: z.string().url().optional(),
    progress: z.number().int().min(0).max(100).default(0),
    categoryNames: z.array(z.string().min(2)).optional(), // when visitor supplies names
    categoryIds: z
        .array(z.string().length(24))
        .optional() // when visitor supplies IDs
        .refine(arr => !arr || arr.every(id => /^[a-f0-9]{24}$/i.test(id)), 'Invalid ObjectId'),
});

export const createSkillSchema = base.refine(d => !!d.categoryNames || !!d.categoryIds, {
    message: 'Either categoryNames or categoryIds is required',
});

export const updateSkillSchema = base.partial();
