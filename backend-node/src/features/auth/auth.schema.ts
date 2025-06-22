import { z } from 'zod';
import { MSG } from '../../core/messages';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const registerSchema = z.object({
    fullName: z.string().min(2, MSG.STRING_MIN('Name', 2)),
    email: z.string().email(MSG.INVALID_EMAIL()),
    password: z.string().min(6, MSG.PASSWORD_MIN()),
    slug: z
        .string()
        .regex(slugRegex, 'Slug must be lowercase letters, numbers, dashes')
        .max(64)
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email(MSG.INVALID_EMAIL()),
    password: z.string().min(6, MSG.PASSWORD_MIN()),
});
