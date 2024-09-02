import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";


export const getUserWithdrawalDetails=createAsyncThunk(
    'withdrawal/getUserWithdrawalDetails',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/withdrawal/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to User Wallet Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const userWithdrawalRequest=createAsyncThunk(
    'withdrawal/userWithdrawalRequest',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/withdrawal/${data}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Execute Withdrawal Request'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const adminWithdrawalRequest=createAsyncThunk(
    'withdrawal/adminWithdrawalRequest',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/withdrawal/admin/${data}/proceed/true`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Execute Withdrawal Request'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

