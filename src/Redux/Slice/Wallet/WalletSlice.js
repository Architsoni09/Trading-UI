import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'; // Import toast for notifications
import {
    depositToUsersWallet,
    getUserWalletDetails,
    getUserWalletTransactions,
    proceedWithPayment,
    walletToWalletTransferRequest
} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";

const initialState = {
    userWalletDetails: {
        data: [],
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    transactions: {
        data: [],
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    depositMoneyRequests: {
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    walletToWalletTransferRequests: {
        data: [],
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    },
    deposits: {
        data: {},
        loading: false,
        error: null,
        toastId: null // Add toastId for managing loading toasts
    }
};

const walletSlice = createSlice({
    name: 'userWallet',
    initialState,
    reducers: {
        resetUserWalletErrorsState: (state) => {
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
        // Get User Wallet Details
        builder
            .addCase(getUserWalletDetails.pending, (state) => {
                state.userWalletDetails.loading = true;
                state.userWalletDetails.error = null;
            })
            .addCase(getUserWalletDetails.fulfilled, (state, action) => {
                state.userWalletDetails.data = action.payload;
                state.userWalletDetails.loading = false;
                state.userWalletDetails.error = null;
            })
            .addCase(getUserWalletDetails.rejected, (state, action) => {
                state.userWalletDetails.loading = false;
                state.userWalletDetails.error = action.payload;
            })

            // Proceed with Payment
            .addCase(proceedWithPayment.pending, (state) => {
                state.deposits.loading = true;
                state.deposits.error = null;
            })
            .addCase(proceedWithPayment.fulfilled, (state, action) => {
                state.deposits.data = action.payload;
                state.deposits.loading = false;
                state.deposits.error = null;
                toast.success('Payment processed successfully!'); // Show success toast
            })
            .addCase(proceedWithPayment.rejected, (state, action) => {
                state.deposits.loading = false;
                state.deposits.error = action.payload;
                toast.error(`Failed to process payment: ${action.payload}`); // Show error toast
            })

            // Deposit to Users Wallet
            .addCase(depositToUsersWallet.pending, (state) => {
                state.depositMoneyRequests.loading = true;
                state.depositMoneyRequests.error = null;
            })
            .addCase(depositToUsersWallet.fulfilled, (state, action) => {
                state.userWalletDetails.data = action.payload;
                state.depositMoneyRequests.loading = false;
                state.depositMoneyRequests.error = null;
                toast.success('Money deposited successfully!'); // Show success toast
            })
            .addCase(depositToUsersWallet.rejected, (state, action) => {
                state.depositMoneyRequests.loading = false;
                state.depositMoneyRequests.error = action.payload;
                toast.error(`Failed to deposit money: ${action.payload}`); // Show error toast
            })

            // Wallet to Wallet Transfer Request
            .addCase(walletToWalletTransferRequest.pending, (state) => {
                state.walletToWalletTransferRequests.loading = true;
                state.walletToWalletTransferRequests.error = null;
            })
            .addCase(walletToWalletTransferRequest.fulfilled, (state, action) => {
                state.userWalletDetails.data = action.payload;
                state.walletToWalletTransferRequests.loading = false;
                state.walletToWalletTransferRequests.error = null;
                toast.success('Wallet-to-wallet transfer successful!'); // Show success toast
            })
            .addCase(walletToWalletTransferRequest.rejected, (state, action) => {
                state.walletToWalletTransferRequests.loading = false;
                state.walletToWalletTransferRequests.error = action.payload;
                toast.error(`Failed to process transfer request: ${action.payload}`); // Show error toast
            })

            // Get User Wallet Transactions
            .addCase(getUserWalletTransactions.pending, (state) => {
                state.transactions.loading = true;
                state.transactions.error = null;
            })
            .addCase(getUserWalletTransactions.fulfilled, (state, action) => {
                state.transactions.data = action.payload;
                state.transactions.loading = false;
                state.transactions.error = null;
            })
            .addCase(getUserWalletTransactions.rejected, (state, action) => {
                state.transactions.loading = false;
                state.transactions.error = action.payload;
            });
    }
});

export default walletSlice.reducer;

// Selectors for user wallet details
export const selectUserWalletDetails = (state) => state.userWallet.userWalletDetails.data;
export const selectUserWalletDetailsLoading = (state) => state.userWallet.userWalletDetails.loading;
export const selectUserWalletDetailsError = (state) => state.userWallet.userWalletDetails.error;

// Selectors for deposits
export const selectPaymentId = (state) => state.userWallet.deposits.data.paymentId || null;
export const selectDepositsLoading = (state) => state.userWallet.deposits.loading;
export const selectDepositsError = (state) => state.userWallet.deposits.error;

// Selectors for deposit money requests
export const selectDepositMoneyRequestsLoading = (state) => state.userWallet.depositMoneyRequests.loading;
export const selectDepositMoneyRequestsError = (state) => state.userWallet.depositMoneyRequests.error;

// Selectors for Wallet to Wallet Transfer Requests
export const selectWalletToWalletTransferRequestsLoading = (state) => state.userWallet.walletToWalletTransferRequests.loading;
export const selectWalletToWalletTransferRequestsError = (state) => state.userWallet.walletToWalletTransferRequests.error;

// Selectors for wallet transactions
export const selectWalletTransactions = (state) => state.userWallet.transactions.data;
export const selectWalletTransactionsLoading = (state) => state.userWallet.transactions.loading;
export const selectWalletTransactionsError = (state) => state.userWallet.transactions.error;

export const {resetUserWalletErrorsState}=walletSlice.actions;