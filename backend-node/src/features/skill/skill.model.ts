import { Schema, model } from 'mongoose';
import { Skill } from './skill.interface';

const skillSchema = new Schema<Skill>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        proficiency: String,
        years: Number,
        iconName: String,
        iconURL: String,
        progress: { type: Number, min: 0, max: 100, default: 0 },
        categoryIds: [{ type: Schema.Types.ObjectId, ref: 'SkillCategory' }],
    },
    { timestamps: true },
);

export const SkillModel = model<Skill>('Skill', skillSchema);
