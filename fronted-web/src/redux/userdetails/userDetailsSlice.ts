import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialUserDetailsState } from './userDetailsInitialState';
import { UserDetailsInput } from './userdetailsTypes';

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: initialUserDetailsState,
    reducers: {
        setUserDetails(
            state,
            action: PayloadAction<Partial<UserDetailsInput>>,
        ) {
            state.userDetails = { ...state.userDetails, ...action.payload };
        },
        updateUserField(
            state,
            action: PayloadAction<{
                field: keyof UserDetailsInput;
                value: string | number;
            }>,
        ) {
            state.userDetails[action.payload.field] = action.payload
                .value as never;
        },
        resetUserDetails(state) {
            state.userDetails = initialUserDetailsState.userDetails;
        },
    },
});

export const { setUserDetails, updateUserField, resetUserDetails } =
    userDetailsSlice.actions;
export default userDetailsSlice.reducer;
