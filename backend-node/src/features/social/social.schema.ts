import { z } from 'zod';
import { MSG } from '../../core/messages';

const link = z.object({
    platform: z.string().min(2, MSG.STRING_MIN('Platform', 2)),
    url: z.string().url('Invalid URL'),
});

export const upsertSocialSchema = z.object({
    links: z
        .array(link)
        .min(1, 'At least one link')
        // ensure unique platform
        .refine(arr => new Set(arr.map(l => l.platform)).size === arr.length, {
            message: 'Duplicate platform names',
        }),
});
