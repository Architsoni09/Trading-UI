import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const activateAccount=createAsyncThunk(
    'user/activate',
    async (otp,thunkAPI)=>{
        try {
            const response = await fetch(`${baseUrl}/auth/activate-account/${otp.email}/${otp.activationCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.json();
        } catch(err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
)