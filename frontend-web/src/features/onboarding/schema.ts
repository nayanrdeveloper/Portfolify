import { z } from 'zod';

export const basicInfoSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    title: z.string().min(2, 'Title is required (e.g. Frontend Developer)'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    profilePictureUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    location: z.string().optional(),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
