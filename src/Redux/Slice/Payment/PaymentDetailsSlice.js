import { createSlice } from "@reduxjs/toolkit";
import {addPaymentDetails, getUserPaymentDetails} from "@/Redux/AsyncThunk/Payment/PaymentAsyncThunk.js";

const initialState = {
    data: {
        accountNumber: '',
        accountHolderName: '',
        ifscCode: '',
        bankName: ''
    },
    loading: false,
    error: null
}

const paymentSlice = createSlice({
    name: 'paymentDetails',
    initialState,
    reducers: {
        resetPaymentDetailsErrorState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserPaymentDetails.pending, (state) => {
                state.loading = true;  // Set loading to true when the request is pending
                state.error = null;    // Clear any previous error
            })
            .addCase(getUserPaymentDetails.fulfilled, (state, action) => {
                state.data = action.payload; // Set data with the fetched payment details
                state.loading = false;       // Set loading to false once data is fetched
                state.error = null;         // Clear any previous error
            })
            .addCase(getUserPaymentDetails.rejected, (state, action) => {
                state.loading = false;       // Set loading to false when the request fails
                state.error = action.payload; // Set error with the rejection message
            })
            .addCase(addPaymentDetails.pending, (state) => {
                state.loading = true;  // Set loading to true when the request is pending
                state.error = null;    // Clear any previous error
            })
            .addCase(addPaymentDetails.fulfilled, (state, action) => {
                state.data = action.payload; // Update data with the result of adding payment details
                state.loading = false;       // Set loading to false once the action is completed
                state.error = null;         // Clear any previous error
            })
            .addCase(addPaymentDetails.rejected, (state, action) => {
                state.loading = false;       // Set loading to false when request fails
                state.error = action.payload; // Set error with the rejection message
            });

    }
});

export default paymentSlice.reducer;

// Selectors for payment details
export const selectPaymentDetails = (state) => state.paymentDetails.data;
export const selectPaymentDetailsLoading = (state) => state.paymentDetails.loading;
export const selectPaymentDetailsError = (state) => state.paymentDetails.error;
export const {resetPaymentDetailsErrorState}= paymentSlice.actions;
