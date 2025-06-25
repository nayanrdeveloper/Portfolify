// src/redux/projects/projectsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialProjectsState } from './projectsInitialState';
import { Project } from './projectsTypes';

const projectsSlice = createSlice({
    name: 'projects',
    initialState: initialProjectsState,
    reducers: {
        addProject(state, action: PayloadAction<Project>) {
            state.items.push(action.payload);
        },
        removeProject(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                (proj) => proj._id !== action.payload,
            );
        },
    },
});

export const { addProject, removeProject } = projectsSlice.actions;
export default projectsSlice.reducer;
