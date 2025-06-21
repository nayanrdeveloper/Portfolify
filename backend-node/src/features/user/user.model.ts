import { Schema, model } from 'mongoose';
import { User } from './user.interface';

const userSchema = new Schema<User>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        avatarUrl: { type: String },
    },
    { timestamps: true },
);

export const UserModel = model<User>('User', userSchema);
