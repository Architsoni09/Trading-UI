import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signUp } from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import { activateAccount } from "@/Redux/AsyncThunk/Auth/AccountActivationAsyncThunk.js";
import { twoFactorVerification } from "@/Redux/AsyncThunk/Auth/TwoFactorAsyncThunk.js";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

const initialState = {
    userName: '',
    mobileNumber: '',
    email: '',
    password: '',
    isTwoFactorEnabled: false,
    loading: false,
    error: null,
    errorMessage: '',
    isAccountActivated: false,
    isVerificationOtpSent: false,
    toastId: null // Add toastId to manage the loading toast
};

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        clearState: (state) => {
            state.userName = 'Archit';
            state.mobileNumber = '';
            state.email = '';
            state.password = '';
            state.isTwoFactorEnabled = false;
            state.errorMessage = '';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Sign Up
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
                state.toastId = toast.loading('Registering user...'); // Show loading toast and store ID
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.userName = action.payload.userName;
                state.mobileNumber = action.payload.mobileNumber;
                state.email = action.payload.email;
                state.password = '';
                state.errorMessage = '';
                state.isTwoFactorEnabled = action.payload.isTwoFactorEnabled;
                state.isVerificationOtpSent = true;

                // Dismiss the loading toast
                if (state.toastId) {
                    toast.dismiss(state.toastId);
                }

                toast.success('User registered successfully!'); // Show success toast
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.errorMessage = action.payload;

                // Dismiss the loading toast
                if (state.toastId) {
                    toast.dismiss(state.toastId);
                }

                toast.error(`User registration failed: ${action.payload}`); // Show error toast
            })

            // Activate Account
            .addCase(activateAccount.fulfilled, (state, action) => {
                state.isAccountActivated = action.payload;
                toast.success(`Account activation status: ${action.payload ? 'Activated' : 'Not Activated'}`); // Show success toast
            })

            // Two-Factor Verification (if needed)
            .addCase(twoFactorVerification.fulfilled, (state, action) => {
                // Handle two-factor verification if it’s part of your flow
                // This could be an additional state update or toast notification
            });
    }
});

export const isUserVerificationOtpSent = (state) => state.signUp.isVerificationOtpSent;
export const signUpError = (state) => state.signUp.error;
export const signedUpUser = (state) => state.signUp.userName;
export const isAccountActivated = (state) => state.signUp.isAccountActivated;
export const { clearState } = signUpSlice.actions;
export default signUpSlice.reducer;
