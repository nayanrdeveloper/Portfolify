import { Schema, model } from 'mongoose';
import { UserDetails } from './userDetails.interface';

const detailsSchema = new Schema<UserDetails>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
        fullName: String,
        title: String,
        subTitle: String,
        about: String,
        location: String,
        profilePictureUrl: String,
        email: String,
        currentCompany: String,
        yearsOfExperience: Number,
        phoneNumber: String,
        resumeUrl: String,
        dateOfBirth: String,
        websiteUrl: String,
        greetingText: String,
        headLine: String,
        callToActionMessage: String,
        quote: String,
        funFact: String,
    },
    { timestamps: true },
);

export const UserDetailsModel = model<UserDetails>('UserDetails', detailsSchema);
