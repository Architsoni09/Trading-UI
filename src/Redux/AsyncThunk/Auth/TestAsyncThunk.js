import {createAsyncThunk} from "@reduxjs/toolkit";

export const test=createAsyncThunk(
    'user/Test',async (thunkAPI)=>{
        try {
            const response=await fetch('https://jsonplaceholder.typicode.com/posts',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'Unknown error occurred');
            }

            return await response.json();
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)