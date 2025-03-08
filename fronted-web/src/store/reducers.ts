import { combineReducers } from '@reduxjs/toolkit';
import experienceReducer from './features/experience/experienceSlice';

// Combine all feature reducers
const rootReducer = combineReducers({
    experience: experienceReducer,
});

export default rootReducer;
