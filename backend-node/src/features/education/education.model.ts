import { Schema, model } from 'mongoose';
import { Education } from './education.interface';

const educationSchema = new Schema<Education>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        institute: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: String,
        startYear: { type: Number, required: true },
        endYear: Number,
    },
    { timestamps: true },
);

export const EducationModel = model<Education>('Education', educationSchema);
