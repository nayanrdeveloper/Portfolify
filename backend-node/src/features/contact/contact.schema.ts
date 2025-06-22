import { z } from 'zod';
import { MSG } from '../../core/messages';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d+()\s-]{7,20}$/;

export const createContactSchema = z.object({
    name: z.string().min(2, MSG.STRING_MIN('Name', 2)),
    email: z.string().regex(emailRegex, 'Invalid e-mail').optional(),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone').optional(),
    message: z.string().min(2, MSG.STRING_MIN('Message', 2)),
});
