export interface Experience {
    _id?: string;
    user_id?: string;
    title: string;
    company: string;
    location: string;
    startDate: string; // ISO string format, e.g. "2020-09-01T00:00:00.000Z"
    endDate?: string; // ISO string format or empty string if not provided
    isCurrent: boolean;
    description: string;
}

export interface IExperienceResponse {
    status: string;
    message: string;
    data: Experience | Experience[];
}

export interface CreateExperiencePayload {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description: string;
}

export interface UpdateExperiencePayload
    extends Partial<CreateExperiencePayload> {
    id: string;
}
