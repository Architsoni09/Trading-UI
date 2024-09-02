import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const userSignIn=createAsyncThunk(
    'user/sign-in',
    async (credentials, thunkAPI) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'Unknown error occurred');
            }

            else return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)