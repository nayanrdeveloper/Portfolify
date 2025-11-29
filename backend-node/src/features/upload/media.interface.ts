import { Document, Types } from 'mongoose';

export interface Media extends Document {
    user: Types.ObjectId;
    url: string;
    publicId: string;
    format: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
}
