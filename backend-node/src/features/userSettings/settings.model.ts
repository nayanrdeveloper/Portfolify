import { Schema, model } from 'mongoose';
import { UserSettings } from './settings.interface';

const settingsSchema = new Schema<UserSettings>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
        template: { type: String, required: true, default: 'default' },
        customization: {
            primaryColor: { type: String },
            secondaryColor: { type: String },
            backgroundColor: { type: String },
            fontFamily: { type: String },
        },
    },
    { timestamps: true },
);

export const SettingsModel = model<UserSettings>('UserSettings', settingsSchema);
