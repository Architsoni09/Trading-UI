import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast
import { createOrderPayment, fetchAllOrdersForUser, fetchOrderById } from "@/Redux/AsyncThunk/Order/OrderAsyncThunk.js";

const initialState = {
    createOrderPayment: {
        data: {},
        loading: false,
        error: null,
        toastId: null // Add toastId to manage the loading toast
    },
    fetchOrderById: {
        data: {},
        loading: false,
        error: null,
        toastId: null // Add toastId to manage the loading toast
    },
    fetchAllOrdersForUser: {
        data: [],
        loading: false,
        error: null,
        toastId: null // Add toastId to manage the loading toast
    }
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetUserOrdersErrorsState: (state) => {
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
        builder
            // Create Order Payment
            .addCase(createOrderPayment.pending, (state) => {
                state.createOrderPayment.loading = true;
                state.createOrderPayment.error = null;
            })
            .addCase(createOrderPayment.fulfilled, (state, action) => {
                state.createOrderPayment.loading = false;
                state.createOrderPayment.data = action.payload;
                toast.success('Payment processed successfully!'); // Show success toast
            })
            .addCase(createOrderPayment.rejected, (state, action) => {
                state.createOrderPayment.loading = false;
                state.createOrderPayment.error = action.payload;
                toast.error(`Payment failed: ${action.payload}`); // Show error toast
            })

            // Fetch Order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.fetchOrderById.loading = true;
                state.fetchOrderById.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.fetchOrderById.loading = false;
                state.fetchOrderById.data = action.payload;
                toast.success('Order details fetched successfully!'); // Show success toast
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.fetchOrderById.loading = false;
                state.fetchOrderById.error = action.payload;
                toast.error(`Failed to fetch order details: ${action.payload}`); // Show error toast
            })

            // Fetch All Orders for User
            .addCase(fetchAllOrdersForUser.pending, (state) => {
                state.fetchAllOrdersForUser.loading = true;
                state.fetchAllOrdersForUser.error = null;
            })
            .addCase(fetchAllOrdersForUser.fulfilled, (state, action) => {
                state.fetchAllOrdersForUser.loading = false;
                state.fetchAllOrdersForUser.data = action.payload;
                toast.success('Orders fetched successfully!'); // Show success toast
            })
            .addCase(fetchAllOrdersForUser.rejected, (state, action) => {
                state.fetchAllOrdersForUser.loading = false;
                state.fetchAllOrdersForUser.error = action.payload;
                toast.error(`Failed to fetch orders: ${action.payload}`); // Show error toast
            });
    }
});

export default orderSlice.reducer;

// Selectors
export const selectCreateOrderPaymentData = (state) => state.orders.createOrderPayment.data;
export const selectCreateOrderPaymentLoading = (state) => state.orders.createOrderPayment.loading;
export const selectCreateOrderPaymentError = (state) => state.orders.createOrderPayment.error;

export const selectFetchOrderByIdData = (state) => state.orders.fetchOrderById.data;
export const selectFetchOrderByIdLoading = (state) => state.orders.fetchOrderById.loading;
export const selectFetchOrderByIdError = (state) => state.orders.fetchOrderById.error;

export const selectFetchAllOrdersForUserData = (state) => state.orders.fetchAllOrdersForUser.data;
export const selectFetchAllOrdersForUserLoading = (state) => state.orders.fetchAllOrdersForUser.loading;
export const selectFetchAllOrdersForUserError = (state) => state.orders.fetchAllOrdersForUser.error;

export const {resetUserOrdersErrorsState} = orderSlice.actions;