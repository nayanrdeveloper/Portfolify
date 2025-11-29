import { Document, Types } from 'mongoose';

export interface User extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    slug: string;
    password: string;
    avatarUrl?: string;
    isOnboardingCompleted?: boolean;
    profileViews?: number;
    createdAt: Date;
}
