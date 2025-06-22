// userDetails.schema.ts
import { z } from 'zod';
import { MSG } from '../../core/messages';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

const url = z.string().url();

const base = z.object({
    fullName: z.string().min(2, MSG.STRING_MIN('Full name', 2)).optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    about: z.string().optional(),
    location: z.string().optional(),
    profilePictureURL: url.optional(),
    email: z.string().email().optional(),
    currentCompany: z.string().optional(),
    yearsOfExperience: z.number().int().min(0).max(60).optional(),
    phoneNumber: z.string().optional(),
    resumeURL: url.optional(),
    dateOfBirth: isoDate.optional(),
    websiteURL: url.optional(),
    greetingText: z.string().optional(),
    headLine: z.string().optional(),
    callToActionMessage: z.string().optional(),
    quote: z.string().optional(),
    funFact: z.string().optional(),
});

export const upsertDetailsSchema = base; // all optional → upsert
