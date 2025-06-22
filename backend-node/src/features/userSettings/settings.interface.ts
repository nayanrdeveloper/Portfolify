import { Document, Types } from 'mongoose';

export interface UserSettings extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    template: string; // theme key
    createdAt: Date;
}
