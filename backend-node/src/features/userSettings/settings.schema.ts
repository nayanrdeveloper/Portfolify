import { z } from 'zod';

// central list of templates; extend anytime
export const ALLOWED_TEMPLATES = [
    'default',
    'standard',
    'modern',
    'professional',
    'creative',
] as const;

export const updateSettingsSchema = z.object({
    template: z.enum(ALLOWED_TEMPLATES, {
        errorMap: () => ({ message: 'Invalid template name' }),
    }),
    customization: z
        .object({
            primaryColor: z.string().optional(),
            secondaryColor: z.string().optional(),
            backgroundColor: z.string().optional(),
            fontFamily: z.string().optional(),
        })
        .optional(),
    seo: z
        .object({
            title: z.string().optional(),
            description: z.string().optional(),
            keywords: z.array(z.string()).optional(),
            ogImage: z.string().url().optional().or(z.literal('')),
        })
        .optional(),
});
