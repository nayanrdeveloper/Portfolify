import { z } from 'zod';
import { MSG } from '../../core/messages';

export const createCategorySchema = z.object({
    name: z.string().min(2, MSG.STRING_MIN('Category name', 2)),
});

export const updateCategorySchema = createCategorySchema.partial();
