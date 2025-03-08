import { ExperienceItem } from './experienceTypes';

export interface ExperienceState {
    list: ExperienceItem[];
    loading: boolean;
    error: string | null;
}

export const experienceInitialState: ExperienceState = {
    list: [],
    loading: false,
    error: null,
};
