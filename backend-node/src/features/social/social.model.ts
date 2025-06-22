import { Schema, model } from 'mongoose';
import { SocialDoc } from './social.interface';

const linkSchema = new Schema(
    {
        platform: { type: String, required: true, lowercase: true, trim: true },
        url: { type: String, required: true },
    },
    { _id: false },
);

const socialSchema = new Schema<SocialDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
        links: { type: [linkSchema], default: [] },
    },
    { timestamps: true },
);

export const SocialModel = model<SocialDoc>('SocialMedia', socialSchema);
