export interface UserDetails {
    id: string;
    user_id: string;
    title: string;
    bio: string;
    location: string;
    profile_picture_url: string;
    github_url: string;
    linkedin_url: string;
    twitter_url: string;
    created_at: string;
    updated_at: string;
}

export interface IUserDetailsResponse {
    status: string;
    message: string;
    data: UserDetails;
}

// Input for creating/updating user details.
// All fields are optional to allow partial updates.
export interface UserDetailsInput {
    title?: string;
    bio?: string;
    location?: string;
    profile_picture_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
}
