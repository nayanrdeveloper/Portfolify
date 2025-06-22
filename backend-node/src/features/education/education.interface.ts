import { Document, Types } from 'mongoose';

export interface Education extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId; // FK
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: Date;
    endDate?: Date | null;
    isCurrent: boolean;
    description?: string;
    createdAt: Date;
}
