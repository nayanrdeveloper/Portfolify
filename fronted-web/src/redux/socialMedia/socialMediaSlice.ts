import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSocialMediaState } from './socialMediaInitialState';
import { SocialMediaInput } from './socialMediaTypes';

const socialMediaSlice = createSlice({
    name: 'socialMedia',
    initialState: initialSocialMediaState,
    reducers: {
        setSocialMedia(
            state,
            action: PayloadAction<Partial<SocialMediaInput>>,
        ) {
            state.socialMediaDetails = {
                ...state.socialMediaDetails,
                ...action.payload,
            };
        },
        updateSocialMediaField(
            state,
            action: PayloadAction<{
                field: keyof SocialMediaInput;
                value: string;
            }>,
        ) {
            state.socialMediaDetails[action.payload.field] =
                action.payload.value;
        },
        resetSocialMedia(state) {
            state.socialMediaDetails =
                initialSocialMediaState.socialMediaDetails;
        },
    },
});

export const { setSocialMedia, updateSocialMediaField, resetSocialMedia } =
    socialMediaSlice.actions;

export default socialMediaSlice.reducer;
