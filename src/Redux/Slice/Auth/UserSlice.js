import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserDetails, updateUserDetails } from "@/Redux/AsyncThunk/Auth/UserDetailsAsyncThunk.js";
import { toast } from 'react-hot-toast';
import {editTwoFactorVerification} from "@/Redux/AsyncThunk/Auth/TwoFactorAsyncThunk.js"; // Import toast from react-hot-toast

// Initial state
const initialState = {
    data: {
        id: null,
        username: "",
        mobileNumber: "",
        email: "",
        accountLocked: false,
        activationCode: "",
        password: "",
        address: "",
        city: "",
        pinCode: "",
        nationality: "",
        country: "",
        dateOfBirth: null,
        twoFactorAuth: {
            verificationType: "",
            twoFactorEnabled: false,
            isUserVerified: null
        },
        roles: [
            {
                id: null,
                roleName: "",
                createdDate: null,
                lastModifiedDate: null
            }
        ],
        name: "",
        enabled: false,
        credentialsNonExpired: false,
        accountNonExpired: false,
        authorities: [
            {
                authority: ""
            }
        ],
        activated: false,
        accountNonLocked: false,
    },
    loading: false,
    error: null,
    toastId: null // Add toastId to manage the loading toast
};

// User slice
const userSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers: {
        resetUserDetailsErrorsState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get User Details
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.data = { ...state.data, ...action.payload };
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update User Details
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.data = { ...state.data, ...action.payload };
                state.loading = false;
                state.error = null;
                toast.success('User details updated successfully!'); // Show success toast
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(`Failed to update user details: ${action.payload}`); // Show error toast
            })
            .addCase(editTwoFactorVerification.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
                state.error = null; // Clear any previous error
                state.toastId = toast.loading('Processing two-factor verification...'); // Show loading toast
            })
            .addCase(editTwoFactorVerification.fulfilled, (state, action) => {
                state.data = action.payload// Update twoFactorAuth data
                state.loading = false; // Set loading to false once action is completed
                state.error = null; // Clear any previous error
                toast.dismiss(state.toastId); // Dismiss loading toast
                toast.success('Two-factor authentication updated successfully!'); // Show success toast
            })
            .addCase(editTwoFactorVerification.rejected, (state, action) => {
                state.loading = false; // Set loading to false when request fails
                state.error = action.payload; // Set error with the rejection message
                toast.dismiss(state.toastId); // Dismiss loading toast
                toast.error(`Failed to update two-factor authentication: ${action.payload}`); // Show error toast
            });
    },
});

export default userSlice.reducer;

// Selectors
export const selectUserName = (state) => state.userDetails.data.name;
export const selectUserDetails = (state) => state.userDetails.data;
export const selectTwoFactorVerificationStatus = (state) => state.userDetails.data.twoFactorAuth.twoFactorEnabled;
export const selectUserDetailsLoading = (state) => state.userDetails.loading;
export const selectUserDetailsError = (state) => state.userDetails.error;
export const {resetUserDetailsErrorsState} =userSlice.actions;