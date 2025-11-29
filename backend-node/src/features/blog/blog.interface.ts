import { Document, Types } from 'mongoose';

export interface Blog extends Document {
    user: Types.ObjectId;
    title: string;
    slug: string;
    content: string; // Markdown content
    summary?: string;
    coverImage?: string;
    tags: string[];
    isPublished: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
