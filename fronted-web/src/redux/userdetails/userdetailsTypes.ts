export interface UserDetails {
    id: string;
    user_id: string;
    title: string;
    sub_title: string;
    about: string;
    location: string;
    full_name: string;
    profile_picture_url: string;
    email: string;
    current_company: string;
    years_of_experience: number;
    phone_number: string;
    resume_url: string;
    date_of_birth: string;
    website_url: string;
    greeting_text: string;
    head_line: string;
    call_to_action: string;
    quote: string;
    fun_fact: string;
    created_at: string;
    updated_at: string;
}

export interface IUserDetailsResponse {
    status: string;
    message: string;
    data: UserDetails;
}

export interface UserDetailsInput {
    title?: string;
    sub_title?: string;
    about?: string;
    location?: string;
    full_name?: string;
    profile_picture_url?: string;
    email?: string;
    current_company?: string;
    years_of_experience?: number;
    phone_number?: string;
    resume_url?: string;
    date_of_birth?: string;
    website_url?: string;
    greeting_text?: string;
    head_line?: string;
    call_to_action?: string;
    quote?: string;
    fun_fact?: string;
}

export interface UserDetailsState {
    userDetails: UserDetailsInput;
}
