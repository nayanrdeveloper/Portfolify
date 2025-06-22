import { Schema, model } from 'mongoose';
import { Achievement } from './achievement.interface';

const achievementSchema = new Schema<Achievement>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expirationDate: Date,
        credentialID: String,
        credentialURL: String,
        description: String,
    },
    { timestamps: true },
);

export const AchievementModel = model<Achievement>('Achievement', achievementSchema);
