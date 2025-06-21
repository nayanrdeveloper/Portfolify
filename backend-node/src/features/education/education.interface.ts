import { Document, Types } from 'mongoose';

export interface Education extends Document {
    user: Types.ObjectId; // FK
    institute: string;
    degree: string;
    fieldOfStudy?: string;
    startYear: number;
    endYear?: number;
}
