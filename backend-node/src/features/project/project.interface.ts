import { Document, Types } from 'mongoose';

export interface Project extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    description?: string;
    demoLink?: string;
    githubLink?: string;
    mediaUrls?: string[];
    createdAt: Date;
}
