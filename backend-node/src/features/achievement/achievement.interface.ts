import { Document, Types } from 'mongoose';

export interface Achievement extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    issuer: string;
    issueDate: Date;
    expirationDate?: Date | null;
    credentialID?: string;
    credentialURL?: string;
    description?: string;
    createdAt: Date;
}
