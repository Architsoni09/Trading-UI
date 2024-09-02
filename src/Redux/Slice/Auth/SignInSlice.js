import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast
import { userSignIn } from "@/Redux/AsyncThunk/Auth/SignInAsyncThunk.js";
import { twoFactorVerification } from "@/Redux/AsyncThunk/Auth/TwoFactorAsyncThunk.js";

const initialState = {
    jwtToken: '',                // Initially, the token is an empty string
    message: '',                 // Initially, there is no message
    status: false,               // Initially, status is false (not logged in or not successful)
    isTwoFactorAuthEnabled: false, // Initially, two-factor authentication is not enabled
    otpId: '',                   // Initially, there is no otpId
    isUserSignedIn: false,       // Initially, there is no user
    twoFactorAuthenticationStatus: '', // Initially, no status for two-factor authentication
    toastId: null                // Store toast ID for loading toast
};

const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(userSignIn.pending, (state) => {
                state.status = false;
                state.toastId = toast.loading('Signing in...'); // Show loading toast and store ID
            })
            .addCase(userSignIn.fulfilled, (state, action) => {
                state.jwtToken = action.payload.jwtToken;
                state.message = action.payload.message;
                state.status = true;
                state.isTwoFactorAuthEnabled = action.payload.twoFactorAuthEnabled;
                state.otpId = action.payload.session;
                state.isUserSignedIn = !action.payload.twoFactorAuthEnabled;

                // Dismiss the loading toast
                if (state.toastId) {
                    toast.dismiss(state.toastId);
                }

                if (state.isTwoFactorAuthEnabled) {
                    toast.success('Two-factor authentication required. Please verify your OTP.'); // Success toast for 2FA required
                } else {
                    toast.success('Sign in successful!'); // Success toast for sign-in
                }
            })
            .addCase(userSignIn.rejected, (state, action) => {
                state.message = action.payload;
                state.status = false;
                state.isUserSignedIn = false;

                // Dismiss the loading toast
                if (state.toastId) {
                    toast.dismiss(state.toastId);
                }

                toast.error(`Sign in failed: ${action.payload}`); // Error toast for sign-in failure
            })
            .addCase(twoFactorVerification.fulfilled, (state, action) => {
                // Handle two-factor verification only if it is enabled
                if (state.isTwoFactorAuthEnabled) {
                    state.isUserSignedIn = true;
                    state.twoFactorAuthenticationStatus = 'Sign In Successful';
                    toast.success('Two-factor authentication successful!'); // Success toast for 2FA
                }
            })
            .addCase(twoFactorVerification.rejected, (state, action) => {
                // Handle two-factor verification only if it is enabled
                if (state.isTwoFactorAuthEnabled) {
                    state.isUserSignedIn = false;
                    state.twoFactorAuthenticationStatus = 'Wrong OTP';
                    toast.error('Two-factor authentication failed: Wrong OTP'); // Error toast for 2FA failure
                }
            });
    }
});

export const selectJwtToken = (state) => state.signIn.jwtToken;
export const selectStatusOfLogin = (state) => state.signIn.status;
export const selectOtpId = (state) => state.signIn.otpId;
export const twoFactorAuthenticationStatus = (state) => state.signIn.twoFactorAuthenticationStatus;
export const isUserSignedInSignIn = (state) => state.signIn.isUserSignedIn;
export const isTwoFactorEnabledSignIn = (state) => state.signIn.isTwoFactorAuthEnabled;

export default signInSlice.reducer;
