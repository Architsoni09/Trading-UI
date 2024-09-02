import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const getUserPaymentDetails=createAsyncThunk(
    'payment/getUserPaymentDetails',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/payment/user/payment-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (response.status === 404) {
                throw new Error('Payment details not found.'); // Specific error message for 404
            }
            if (!response.ok) {
                throw new Error('Failed to User Wallet Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const addPaymentDetails=createAsyncThunk(
    'payment/addPaymentDetails',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/payment/add/payment-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to Add Payment Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)