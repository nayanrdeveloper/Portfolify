import { Schema, model } from 'mongoose';
import { UserSettings } from './settings.interface';

const settingsSchema = new Schema<UserSettings>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
        template: { type: String, required: true, default: 'default' },
    },
    { timestamps: true },
);

export const SettingsModel = model<UserSettings>('UserSettings', settingsSchema);
