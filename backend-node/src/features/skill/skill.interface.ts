import { Document, Types } from 'mongoose';

export interface Skill extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    proficiency?: string;
    years?: number;
    iconName?: string;
    iconURL?: string;
    progress: number; // 0‥100
    categoryIds: Types.ObjectId[];
    createdAt: Date;
}
