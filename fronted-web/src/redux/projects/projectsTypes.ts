export interface Project {
    id?: string; // MongoDB ObjectID as hex string; optional on creation
    user_id?: string; // user's ObjectID as hex string
    name: string;
    description: string;
    demo_link: string;
    github_link: string;
    media_urls: string[];
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
}

export interface IProjectResponse {
    status: string; // "success" or "error"
    message: string;
    data: Project | Project[];
}

export interface CreateProjectPayload {
    name: string;
    description: string;
    demo_link: string;
    github_link: string;
    media_urls: string[];
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
    id: string;
}
export interface ProjectsState {
    items: Project[];
}
