import { Document } from 'mongoose';

export interface User extends Document {
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}
