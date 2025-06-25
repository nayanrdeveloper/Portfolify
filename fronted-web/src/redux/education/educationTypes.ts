export interface Education {
    _id?: string;
    user_id?: string;
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate: string; // ISO string format
    endDate?: string; // ISO string or empty if not provided
    isCurrent: boolean;
    description?: string;
}

/**
 * Standard API response type.
 */
export interface IEducationResponse {
    status: string; // "success" or "error"
    message: string;
    data: Education | Education[];
}

/**
 * Payload for creating a new education record.
 */
export interface CreateEducationPayload {
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
}

/**
 * Payload for updating an education record.
 */
export interface UpdateEducationPayload
    extends Partial<CreateEducationPayload> {
    id: string;
}
