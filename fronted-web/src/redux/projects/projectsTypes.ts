/* ---------- generic API envelope (matches Node backend) ---------- */
export interface ApiResponse<Data = unknown> {
    message?: string; // optional; backend sends when it has something to say
    data?: Data; // the actual payload (may be undefined on DELETE etc.)
}

/* ---------- project models -------------------------------------- */
export interface Project {
    _id?: string;
    user?: string;
    name: string;
    description: string;
    demoLink: string;
    githubLink: string;
    mediaUrls: string[];
    createdAt?: string;
    updatedAt?: string;
}

/* SINGLE project response */
export type ProjectResponse = ApiResponse<Project>;

/* ARRAY of projects response */
export type ProjectsResponse = ApiResponse<Project[]>;

/* ---------- payloads for mutations ------------------------------ */
export type CreateProjectPayload = Omit<
    Project,
    '_id' | 'user' | 'createdAt' | 'updatedAt'
>;

export type UpdateProjectPayload = Partial<CreateProjectPayload> & {
    id: string;
};

/* ---------- Redux slice state ----------------------------------- */
export interface ProjectsState {
    items: Project[];
}
