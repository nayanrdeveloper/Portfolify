export interface ContactUs {
    id: string;
    owner_user_id: string;
    name: string;
    email?: string;
    phone_number?: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface IContactUsResponse {
    status: string;
    message: string;
    data: ContactUs;
}

export interface IContactUsMessagesResponse {
    status: string;
    message: string;
    data: ContactUs[];
}

export interface ContactUsInput {
    name: string;
    email?: string;
    phone_number?: string;
    message: string;
}
