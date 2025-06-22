import { Schema, model } from 'mongoose';
import { Education } from './education.interface';

const educationSchema = new Schema<Education>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        institution: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String },
    },
    { timestamps: true },
);

export const EducationModel = model<Education>('Education', educationSchema);
