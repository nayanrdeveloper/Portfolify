import { Document, Types } from 'mongoose';

export interface UserDetails extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    fullName?: string;
    title?: string;
    subTitle?: string;
    about?: string;
    location?: string;
    profilePictureUrl?: string;
    email?: string;
    currentCompany?: string;
    yearsOfExperience?: number;
    phoneNumber?: string;
    resumeUrl?: string;
    dateOfBirth?: string;
    websiteUrl?: string;
    greetingText?: string;
    headLine?: string;
    callToActionMessage?: string;
    quote?: string;
    funFact?: string;
    createdAt: Date;
}
