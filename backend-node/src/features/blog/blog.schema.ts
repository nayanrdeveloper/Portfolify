import { z } from 'zod';

export const createBlogSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    summary: z.string().optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();
