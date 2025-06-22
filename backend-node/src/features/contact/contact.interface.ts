import { Document, Types } from 'mongoose';

export interface ContactMessage extends Document {
    _id: Types.ObjectId;
    ownerUser: Types.ObjectId; // portfolio owner
    name: string;
    email?: string;
    phoneNumber?: string;
    message: string;
    createdAt: Date;
}
