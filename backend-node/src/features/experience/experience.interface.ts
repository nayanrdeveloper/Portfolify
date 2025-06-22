import { Document, Types } from 'mongoose';

export interface Experience extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId; // FK
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date | null;
    isCurrent: boolean;
    description?: string;
    createdAt: Date;
}
