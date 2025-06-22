import { z } from 'zod';

// central list of templates; extend anytime
export const ALLOWED_TEMPLATES = ['default', 'theme1', 'theme2'] as const;

export const updateSettingsSchema = z.object({
    template: z.enum(ALLOWED_TEMPLATES, {
        errorMap: () => ({ message: 'Invalid template name' }),
    }),
});
