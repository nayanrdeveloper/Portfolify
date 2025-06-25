/* generic envelope all Node routes return */
export interface ApiEnvelope<Data = unknown> {
    message?: string;
    data: Data;
}

/* ⬇⬇  camel-case model that matches the Node schema  ⬇⬇ */
export interface UserDetails {
    id: string;
    userId: string;
    title: string;
    subTitle: string;
    about: string;
    location: string;
    fullName: string;
    profilePictureUrl: string;
    email: string;
    currentCompany: string;
    yearsOfExperience: number;
    phoneNumber: string;
    resumeUrl: string;
    dateOfBirth: string;
    websiteUrl: string;
    greetingText: string;
    headLine: string;
    callToActionMessage: string;
    quote: string;
    funFact: string;
    createdAt: string;
    updatedAt: string;
}

/* success envelope from the backend */
export type UserDetailsResponse = ApiEnvelope<UserDetails>;

/* payload used when you POST /user-details  */
export type UserDetailsInput = Partial<
    Omit<UserDetails, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

/* slice state */
export interface UserDetailsState {
    userDetails: UserDetailsInput;
}
