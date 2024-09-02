import { createSlice } from "@reduxjs/toolkit";
import { getAllUserAssets } from "@/Redux/AsyncThunk/Asset/AssetAsyncThunk.js";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

const initialState = {
    assets: [],
    loading: false,
    error: null,
    toastId: null // Add toastId to manage the loading toast
};

const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUserAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUserAssets.fulfilled, (state, action) => {
                state.assets = action.payload;
                state.loading = false;
            })
            .addCase(getAllUserAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exporting the reducer
export default assetSlice.reducer;

// Selectors
export const selectAssets = (state) => state.asset.assets;
export const selectAssetsLoading = (state) => state.asset.loading;
export const selectAssetsError = (state) => state.asset.error;
