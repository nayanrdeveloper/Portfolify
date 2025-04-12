export interface SocialMedia {
    id?: string;
    user_id?: string;

    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    youtube?: string;

    created_at?: string;
    updated_at?: string;
}

export interface ISocialMediaResponse {
    status: string;
    message: string;
    data: SocialMedia;
}

export interface SocialMediaInput {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
}

export interface SocialMediaState {
    socialMediaDetails: SocialMediaInput;
}
