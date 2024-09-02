import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'; // Import toast for notifications
import { getUserWithdrawalDetails, userWithdrawalRequest, adminWithdrawalRequest } from "@/Redux/AsyncThunk/Withdrawal/WithdrawalAsyncThunk.js";

const initialState = {
    userWithdrawalDetails: {
        data: [],
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    withdrawalRequest: {
        data: {
            id: '',
            withdrawalStatus: '',
            amount: '',
            dateTime: ''
        },
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    adminRequest: {
        data: {
            id: '',
            withdrawalStatus: '',
            amount: '',
            dateTime: ''
        },
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    }
};

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState,
    reducers: {
        resetUserWithdrawalErrorsState: (state) => {
            Object.keys(state).forEach(key => {
                if (state[key].hasOwnProperty('loading')) {
                    state[key].loading = false;
                }
                if (state[key].hasOwnProperty('error')) {
                    state[key].error = null;
                }
            });
        }
    },
    extraReducers: (builder) => {
        // Get User Withdrawal Details
        builder
            .addCase(getUserWithdrawalDetails.pending, (state) => {
                state.userWithdrawalDetails.loading = true;
                state.userWithdrawalDetails.error = null;
            })
            .addCase(getUserWithdrawalDetails.fulfilled, (state, action) => {
                state.userWithdrawalDetails.loading = false;
                state.userWithdrawalDetails.data = action.payload;
                toast.success('User withdrawal details fetched successfully!'); // Show success toast
            })
            .addCase(getUserWithdrawalDetails.rejected, (state, action) => {
                state.userWithdrawalDetails.loading = false;
                state.userWithdrawalDetails.error = action.payload;
                toast.error(`Failed to fetch user withdrawal details: ${action.payload}`); // Show error toast
            })
            .addCase(userWithdrawalRequest.pending, (state) => {
                state.withdrawalRequest.loading = true;
                state.withdrawalRequest.error = null;
                state.withdrawalRequest.toastId = toast.loading('Processing withdrawal request...'); // Show loading toast
            })
            .addCase(userWithdrawalRequest.fulfilled, (state, action) => {
                state.withdrawalRequest.loading = false;
                state.withdrawalRequest.data = action.payload;
                toast.dismiss(state.withdrawalRequest.toastId); // Dismiss loading toast
                toast.success('Withdrawal request processed successfully!'); // Show success toast
            })
            .addCase(userWithdrawalRequest.rejected, (state, action) => {
                state.withdrawalRequest.loading = false;
                state.withdrawalRequest.error = action.payload;
                toast.dismiss(state.withdrawalRequest.toastId); // Dismiss loading toast
                toast.error(`Failed to process withdrawal request: ${action.payload}`); // Show error toast
            })
            .addCase(adminWithdrawalRequest.pending, (state) => {
                state.adminRequest.loading = true;
                state.adminRequest.error = null;
                state.adminRequest.toastId = toast.loading('Processing admin withdrawal request...'); // Show loading toast
            })
            .addCase(adminWithdrawalRequest.fulfilled, (state, action) => {
                state.adminRequest.loading = false;
                state.adminRequest.data = action.payload;
                toast.dismiss(state.adminRequest.toastId); // Dismiss loading toast
                toast.success('Admin withdrawal request processed successfully!'); // Show success toast
            })
            .addCase(adminWithdrawalRequest.rejected, (state, action) => {
                state.adminRequest.loading = false;
                state.adminRequest.error = action.payload;
                toast.dismiss(state.adminRequest.toastId); // Dismiss loading toast
                toast.error(`Failed to process admin withdrawal request: ${action.payload}`); // Show error toast
            });
    }
});

export default withdrawalSlice.reducer;

// Define selectors for the withdrawal slice
export const selectUserWithdrawalDetailsData = (state) => state.withdrawal.userWithdrawalDetails.data;
export const selectUserWithdrawalDetailsLoading = (state) => state.withdrawal.userWithdrawalDetails.loading;
export const selectUserWithdrawalDetailsError = (state) => state.withdrawal.userWithdrawalDetails.error;

export const selectWithdrawalRequestData = (state) => state.withdrawal.withdrawalRequest.data;
export const selectWithdrawalRequestLoading = (state) => state.withdrawal.withdrawalRequest.loading;
export const selectWithdrawalRequestError = (state) => state.withdrawal.withdrawalRequest.error;

export const selectAdminRequestData = (state) => state.withdrawal.adminRequest.data;
export const selectAdminRequestLoading = (state) => state.withdrawal.adminRequest.loading;
export const selectAdminRequestError = (state) => state.withdrawal.adminRequest.error;

export const {resetUserWithdrawalErrorsState}=withdrawalSlice.actions;