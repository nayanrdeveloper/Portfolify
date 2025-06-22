import { Document, Types } from 'mongoose';

export interface UserDetails extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    fullName?: string;
    title?: string;
    subTitle?: string;
    about?: string;
    location?: string;
    profilePictureURL?: string;
    email?: string;
    currentCompany?: string;
    yearsOfExperience?: number;
    phoneNumber?: string;
    resumeURL?: string;
    dateOfBirth?: string;
    websiteURL?: string;
    greetingText?: string;
    headLine?: string;
    callToActionMessage?: string;
    quote?: string;
    funFact?: string;
    createdAt: Date;
}
