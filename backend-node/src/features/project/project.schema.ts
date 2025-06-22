import { z } from 'zod';
import { MSG } from '../../core/messages';

const base = z.object({
    name: z.string().min(2, MSG.STRING_MIN('Name', 2)),
    description: z.string().optional(),
    demoLink: z.string().url().optional(),
    githubLink: z.string().url().optional(),
    mediaUrls: z.array(z.string().url()).optional(),
});

export const createProjectSchema = base;
export const updateProjectSchema = base.partial();
