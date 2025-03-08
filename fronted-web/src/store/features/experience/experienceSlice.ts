import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { experienceInitialState } from './experienceInitialState';
import { ExperienceItem } from './experienceTypes';

export const experienceSlice = createSlice({
    name: 'experience',
    initialState: experienceInitialState,
    reducers: {
        addExperience(state, action: PayloadAction<ExperienceItem>) {
            state.list.push(action.payload);
        },
        removeExperience(state, action: PayloadAction<string>) {
            state.list = state.list.filter((exp) => exp.id !== action.payload);
        },
    },
});

export const { addExperience, removeExperience } = experienceSlice.actions;
export default experienceSlice.reducer;
