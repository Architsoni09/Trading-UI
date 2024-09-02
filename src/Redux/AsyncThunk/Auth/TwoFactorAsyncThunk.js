import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";


export const twoFactorVerification=createAsyncThunk(
    'user/two-factor-verification'
    ,async (data,thunkAPI) =>{
        try {
            const response = await fetch(`${baseUrl}/auth/verify-otp/${data.otp}/${data.otpId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'Unknown error occurred');
            }

            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const editTwoFactorVerification=createAsyncThunk(
    'user/edit-two-factor-verification'
    ,async (data,thunkAPI) =>{
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/users/${data}-two-factor-authentication`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'Unknown error occurred');
            }

            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)