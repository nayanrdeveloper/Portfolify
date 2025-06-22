import { Schema, model } from 'mongoose';
import { SkillCategory } from './category.interface';

const categorySchema = new Schema<SkillCategory>(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

export const CategoryModel = model<SkillCategory>('SkillCategory', categorySchema);
