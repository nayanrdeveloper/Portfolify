import { Schema, model } from 'mongoose';
import { Media } from './media.interface';

const mediaSchema = new Schema<Media>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        format: { type: String },
        size: { type: Number },
    },
    { timestamps: true },
);

export const MediaModel = model<Media>('Media', mediaSchema);
