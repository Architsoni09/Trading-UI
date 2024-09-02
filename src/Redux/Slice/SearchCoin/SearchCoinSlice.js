import { createSlice } from "@reduxjs/toolkit";
import {getSearchDetails} from "@/Redux/SearchCoins/SearchCoinAsyncThunk.js";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const searchCoinSlice = createSlice({
    name: 'searchCoin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSearchDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSearchDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.coins;
                state.error=false;
            })
            .addCase(getSearchDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default searchCoinSlice.reducer;

// Selectors for searchCoin slice
export const selectSearchData = (state) => state.searchCoin.data;
export const selectSearchLoading = (state) => state.searchCoin.loading;
export const selectSearchError = (state) => state.searchCoin.error;
