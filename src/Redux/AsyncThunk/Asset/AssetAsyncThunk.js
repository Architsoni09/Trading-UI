import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const getAllUserAssets=createAsyncThunk(
    'asset/getAllUserAssets',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/asset/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Fetch Asset Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)