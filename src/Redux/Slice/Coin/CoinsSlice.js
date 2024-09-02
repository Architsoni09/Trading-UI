import { createSlice } from "@reduxjs/toolkit";
import {
    getAllCoinDetails,
    getCoinById,
    getMarketChartByCoinId,
    getSpecificCoinDetailsById,
    getTop50CoinDetails,
    getTrendingCoins
} from "@/Redux/AsyncThunk/Coin/CoinDetailsAsyncThunk.js";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

const initialState = {
    top50Coins: {
        data: [],
        loading: false,
        error: null
    },
    allCoins: {
        data: [],
        loading: false,
        error: null
    },
    specificCoinDetails: {
        data: {},
        loading: false,
        error: null
    },
    marketChart: {
        data: {},
        loading: false,
        error: null
    },
    trendingCoins: {
        data: [],
        loading: false,
        error: null
    },
    coinById: {
        data: {},
        loading: false,
        error: null
    }
};

const coinDetailsSlice = createSlice({
    name: 'coinDetails',
    initialState,
    reducers: {
        clearMarketChartError(state) {
            Object.keys(state).forEach(key => {
                if (state[key].hasOwnProperty('loading')) {
                    state[key].loading = false;
                }
                if (state[key].hasOwnProperty('error')) {
                    state[key].error = null;
                }
            });
        }
    },
    extraReducers: (builder) => {
        // Top 50 Coins
        builder
            .addCase(getTop50CoinDetails.pending, (state) => {
                state.top50Coins.loading = true;
                state.top50Coins.error = null;
            })
            .addCase(getTop50CoinDetails.fulfilled, (state, action) => {
                state.top50Coins.data = action.payload;
                state.top50Coins.loading = false;
            })
            .addCase(getTop50CoinDetails.rejected, (state, action) => {
                state.top50Coins.loading = false;
                state.top50Coins.error = action.error.message;
                toast.error(`Failed to fetch top 50 coins: ${action.error.message}`);
            })

            // All Coins
            .addCase(getAllCoinDetails.pending, (state) => {
                state.allCoins.loading = true;
                state.allCoins.error = null;
            })
            .addCase(getAllCoinDetails.fulfilled, (state, action) => {
                state.allCoins.data = action.payload;
                state.allCoins.loading = false;
            })
            .addCase(getAllCoinDetails.rejected, (state, action) => {
                state.allCoins.loading = false;
                state.allCoins.error = action.error.message;
                toast.error(`Failed to fetch all coins: ${action.error.message}`);
            })

            // Trending Coins
            .addCase(getTrendingCoins.pending, (state) => {
                state.trendingCoins.loading = true;
                state.trendingCoins.error = null;
            })
            .addCase(getTrendingCoins.fulfilled, (state, action) => {
                state.trendingCoins.data = action.payload;
                state.trendingCoins.loading = false;
            })
            .addCase(getTrendingCoins.rejected, (state, action) => {
                state.trendingCoins.loading = false;
                state.trendingCoins.error = action.error.message;
                toast.error(`Failed to fetch trending coins: ${action.error.message}`);
            })

            // Specific Coin Details By ID
            .addCase(getSpecificCoinDetailsById.pending, (state) => {
                state.specificCoinDetails.loading = true;
                state.specificCoinDetails.error = null;
            })
            .addCase(getSpecificCoinDetailsById.fulfilled, (state, action) => {
                const { id, data } = action.payload;
                state.specificCoinDetails.data[id] = { ...data };
                state.specificCoinDetails.loading = false;
            })
            .addCase(getSpecificCoinDetailsById.rejected, (state, action) => {
                state.specificCoinDetails.loading = false;
                state.specificCoinDetails.error = action.error.message;
                toast.error(`Failed to fetch specific coin details: ${action.error.message}`);
            })

            // Market Chart By Coin ID
            .addCase(getMarketChartByCoinId.pending, (state) => {
                state.marketChart.loading = true;
                state.marketChart.error = null;
            })
            .addCase(getMarketChartByCoinId.fulfilled, (state, action) => {
                const { id: coinId, ...chartData } = action.payload;
                if (state.marketChart.data[coinId]) {
                    state.marketChart.data[coinId] = { ...state.marketChart.data[coinId], ...chartData };
                } else {
                    state.marketChart.data[coinId] = chartData;
                }
                state.marketChart.loading = false;
            })
            .addCase(getMarketChartByCoinId.rejected, (state, action) => {
                state.marketChart.loading = false;
                state.marketChart.error = action.error.message;
                toast.error(`Failed to fetch market chart data: ${action.error.message}`);
            })
            // Coin By ID
            .addCase(getCoinById.pending, (state) => {
                state.coinById.loading = true;
                state.coinById.error = null;
            })
            .addCase(getCoinById.fulfilled, (state, action) => {
                const coinId = action.payload.id;
                state.coinById.data[coinId] = action.payload;
                state.coinById.loading = false;
            })
            .addCase(getCoinById.rejected, (state, action) => {
                state.coinById.loading = false;
                state.coinById.error = action.error.message;
                toast.error(`Failed to fetch coin details: ${action.error.message}`);
            });
    }
});

export default coinDetailsSlice.reducer;

// Selectors for top 50 coins
export const selectTop50Coins = (state) => state.coinDetails.top50Coins.data;
export const selectTop50CoinsLoading = (state) => state.coinDetails.top50Coins.loading;
export const selectTop50CoinsError = (state) => state.coinDetails.top50Coins.error;

// Selectors for all coins
export const selectAllCoins = (state) => state.coinDetails.allCoins.data;
export const selectAllCoinsLoading = (state) => state.coinDetails.allCoins.loading;
export const selectAllCoinsError = (state) => state.coinDetails.allCoins.error;

// Selectors for specific coin details by ID
export const selectSpecificCoinDetailsById = (state, coinId) => {
    return state.coinDetails.specificCoinDetails.data[coinId] || {};
};
export const selectSpecificCoinDetailsLoading = (state) => state.coinDetails.specificCoinDetails.loading;
export const selectSpecificCoinDetailsError = (state) => state.coinDetails.specificCoinDetails.error;

// Selectors for market chart data by coin ID
export const selectMarketChartForACoin = (state, coinId, activeLabel) => {
    if (coinId && activeLabel) {
        const entireDataRelatedToThatCoinYet = state.coinDetails.marketChart.data[coinId];
        if (!entireDataRelatedToThatCoinYet) return {};
        return entireDataRelatedToThatCoinYet[activeLabel] || {};
    }
    else return {};
};
export const selectMarketChartLoading = (state) => state.coinDetails.marketChart.loading;
export const selectMarketChartError = (state) => state.coinDetails.marketChart.error;
export const { clearMarketChartError } = coinDetailsSlice.actions;

// Selectors for trending coins
export const selectTopTrendingCoins = (state) => state.coinDetails.trendingCoins.data;
export const selectTopTrendingCoinsLoading = (state) => state.coinDetails.trendingCoins.loading;
export const selectTopTrendingCoinsError = (state) => state.coinDetails.trendingCoins.error;


// Selectors for coin details by ID
export const selectCoinById = (state, coinId) => {
    return state.coinDetails.coinById.data[coinId] || {};
};
export const selectCoinByIdLoading = (state) => state.coinDetails.coinById.loading;
export const selectCoinByIdError = (state) => state.coinDetails.coinById.error;
