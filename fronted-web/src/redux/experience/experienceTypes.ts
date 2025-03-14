export interface Experience {
    id?: string;
    user_id?: string;
    title: string;
    company: string;
    location: string;
    start_date: string; // ISO string format, e.g. "2020-09-01T00:00:00.000Z"
    end_date?: string; // ISO string format or empty string if not provided
    is_current: boolean;
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
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    description: string;
}

export interface UpdateExperiencePayload
    extends Partial<CreateExperiencePayload> {
    id: string;
}
