import { z } from 'zod';

export const createUserSchema = z.object({
    fullName: z.string().min(2, 'Name too short'),
    email: z.string().email(),
    avatarUrl: z.string().url().optional(),
});
