import { z } from 'zod';

export const basicInfoSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    title: z.string().min(2, 'Title is required (e.g. Frontend Developer)'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    profilePictureUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    location: z.string().optional(),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export const skillSchema = z.object({
    name: z.string().min(2, 'Skill name must be at least 2 characters'),
    proficiency: z.string().optional(),
    progress: z.number().min(0).max(100),
    categoryNames: z.array(z.string()).optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

export interface Skill {
    _id: string;
    name: string;
    proficiency?: string;
    progress: number;
    categoryNames?: string[];
}

export const projectSchema = z.object({
    name: z.string().min(2, 'Project name must be at least 2 characters'),
    description: z.string().optional(),
    demoLink: z.string().url('Invalid URL').optional().or(z.literal('')),
    githubLink: z.string().url('Invalid URL').optional().or(z.literal('')),
    mediaUrls: z.array(z.string()).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export interface Project {
    _id: string;
    name: string;
    description?: string;
    demoLink?: string;
    githubLink?: string;
    mediaUrls?: string[];
}

export const experienceSchema = z
    .object({
        title: z.string().min(2, 'Title must be at least 2 characters'),
        company: z.string().min(2, 'Company must be at least 2 characters'),
        location: z.string().optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
            .optional()
            .or(z.literal('')),
        isCurrent: z.boolean().optional(),
        description: z.string().optional(),
    })
    .refine(
        data => {
            if (data.endDate && data.startDate && data.endDate < data.startDate) {
                return false;
            }
            return true;
        },
        {
            message: 'End date cannot be before start date',
            path: ['endDate'],
        },
    );

export type ExperienceFormData = z.infer<typeof experienceSchema>;

export interface Experience {
    _id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
}

export const educationSchema = z.object({
    institution: z.string().min(2, 'Institution must be at least 2 characters'),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
        .optional()
        .or(z.literal('')),
    isCurrent: z.boolean().optional(),
    description: z.string().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

export interface Education {
    _id: string;
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
}

export const contactInfoSchema = z.object({
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

export const socialLinkSchema = z.object({
    platform: z.string().min(2, 'Platform name is required'),
    url: z.string().url('Invalid URL'),
});

export const socialSchema = z.object({
    links: z.array(socialLinkSchema),
});

export type SocialFormData = z.infer<typeof socialSchema>;

export interface SocialLink {
    platform: string;
    url: string;
}

export const achievementSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        issuer: z.string().min(2, 'Issuer must be at least 2 characters'),
        issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        expirationDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
            .optional()
            .or(z.literal('')),
        credentialID: z.string().optional(),
        credentialURL: z.string().url('Invalid URL').optional().or(z.literal('')),
        mediaUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
        description: z.string().optional(),
    })
    .refine(
        data => {
            if (data.expirationDate && data.issueDate && data.expirationDate < data.issueDate) {
                return false;
            }
            return true;
        },
        {
            message: 'Expiration date cannot be before issue date',
            path: ['expirationDate'],
        },
    );

export type AchievementFormData = z.infer<typeof achievementSchema>;

export interface Achievement {
    _id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialID?: string;
    credentialURL?: string;
    mediaUrl?: string;
    description?: string;
}
