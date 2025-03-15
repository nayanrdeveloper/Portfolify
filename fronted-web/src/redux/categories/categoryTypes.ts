export interface Category {
    id?: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface ICategoryResponse {
    status: string;
    message: string;
    data: Category | Category[];
}

export interface CreateCategoryPayload {
    name: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
    id: string;
}
