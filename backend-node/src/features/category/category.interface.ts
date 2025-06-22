import { Document, Types } from 'mongoose';

export interface SkillCategory extends Document {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
}
