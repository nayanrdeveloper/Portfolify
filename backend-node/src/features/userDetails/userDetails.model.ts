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
        profilePictureURL: String,
        email: String,
        currentCompany: String,
        yearsOfExperience: Number,
        phoneNumber: String,
        resumeURL: String,
        dateOfBirth: String,
        websiteURL: String,
        greetingText: String,
        headLine: String,
        callToActionMessage: String,
        quote: String,
        funFact: String,
    },
    { timestamps: true },
);

export const UserDetailsModel = model<UserDetails>('UserDetails', detailsSchema);
