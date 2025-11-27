import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    slug: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Username must be lowercase letters, numbers, and dashes only')
        .optional()
        .or(z.literal('')),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
