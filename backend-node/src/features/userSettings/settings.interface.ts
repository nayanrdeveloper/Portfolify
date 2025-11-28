import { Document, Types } from 'mongoose';

export interface UserSettings extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    template: string; // theme key
    customization?: {
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        fontFamily?: string;
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
    createdAt: Date;
}
