export interface Project {
    id: string;
    title: string;
    description: string;
}

export interface ProjectsState {
    items: Project[];
}
