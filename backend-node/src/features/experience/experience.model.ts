import { Schema, model } from 'mongoose';
import { Experience } from './experience.interface';

const experienceSchema = new Schema<Experience>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
    },
    { timestamps: true },
);

export const ExperienceModel = model<Experience>('Experience', experienceSchema);
