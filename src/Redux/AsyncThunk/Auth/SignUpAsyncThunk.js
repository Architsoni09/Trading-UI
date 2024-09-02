import {createAsyncThunk} from '@reduxjs/toolkit';

export const baseUrl ='http://localhost:9080';
export const signUp = createAsyncThunk(
    'users/sign-up',
    async (credentials, thunkAPI) => {
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.status === 202) {
                return await response.json(); // Handle accepted case
            } else if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'Unknown error occurred');
            }

            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
