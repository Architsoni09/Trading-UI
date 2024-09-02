import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const createOrderPayment = createAsyncThunk(
    'order/createOrderPayment',
    async (data, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/orders/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to create order payment');
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Fetch Order by ID
export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (orderId, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order by ID');
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Fetch All Orders for User
export const fetchAllOrdersForUser = createAsyncThunk(
    'order/fetchAllOrdersForUser',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/orders/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);