import { Document, Types } from 'mongoose';

export interface SocialLink {
    platform: string; // e.g. 'linkedin', 'x', 'github'
    url: string; // must be valid https://…
}

export interface SocialDoc extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    links: SocialLink[];
    createdAt: Date;
}
