import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast'; // Import toast for notifications
import { getUserWatchlistDetails } from "@/Redux/AsyncThunk/WatchList/WatchListAsyncThunk.js";

const initialState = {
    data: null,
    loading: false,
    error: null,
    toastId: null // Add toastId for managing loading toasts
};

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        resetWatchListErrorState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserWatchlistDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWatchlistDetails.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                toast.success('Watchlist fetched successfully!'); // Show success toast
            })
            .addCase(getUserWatchlistDetails.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                toast.error(`Failed to fetch watchlist: ${action.payload}`); // Show error toast
            });
    }
});

// Export the reducer to be used in the store
export default watchlistSlice.reducer;

// Selectors for watchlist state
export const selectWatchlistData = (state) => state.watchlist.data?.coins || null;
export const selectWatchlistLoading = (state) => state.watchlist.loading;
export const selectWatchlistError = (state) => state.watchlist.error;

export const {resetWatchListErrorState}=watchlistSlice.actions;

