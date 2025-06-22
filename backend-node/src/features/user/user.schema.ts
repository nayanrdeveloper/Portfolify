import { z } from 'zod';
import { MSG } from '../../core/messages';

export const createUserSchema = z.object({
    fullName: z.string().min(2, MSG.STRING_MIN('Name', 2)),
    email: z.string().email(MSG.INVALID_EMAIL()),
    avatarUrl: z.string().url().optional(),
});
