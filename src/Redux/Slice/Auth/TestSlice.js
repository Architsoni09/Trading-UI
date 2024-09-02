import { createSlice } from "@reduxjs/toolkit";
import { test } from "@/Redux/AsyncThunk/Auth/TestAsyncThunk.js";

const initialState = {
    message: '',
    isLoading: false,
    error: null,
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(test.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(test.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
            })
            .addCase(test.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Unknown error occurred';
            });
    },
});

export const testSelector = (state) => state.test;

export default testSlice.reducer;
