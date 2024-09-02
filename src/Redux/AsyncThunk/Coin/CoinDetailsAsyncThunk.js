import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import { selectJwtToken } from "@/Redux/Slice/Auth/SignInSlice.js";

// Fetches the top 50 coins by market cap
export const getTop50CoinDetails = createAsyncThunk(
    'getTop50CoinDetails',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/coins/top-50`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch top 50 coins'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);

// Fetches all coin details (list)
export const getAllCoinDetails = createAsyncThunk(
    'getAllCoins',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/coins/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch all coins'); 
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);

// Fetches specific coin details by ID
export const getSpecificCoinDetailsById = createAsyncThunk(
    'getSpecificCoins',
    async (arg, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/coins/details/${arg}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch details for coin ID: ${arg}`); 
            }
            const dataFromApi= await response.json();
            const resultingObject = {
                id:arg,
                data:dataFromApi
            };
            return resultingObject;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);

// Fetches market chart data by coin ID
export const getMarketChartByCoinId = createAsyncThunk(
    'marketChart',
    async (arg, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);

            // Helper function to fetch market chart data
            const fetchMarketChart = async () => {
                const response = await fetch(`${baseUrl}/api/coins/market-chart?coin_id=${arg.coinId}&days=${arg.days}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch market chart data for ${arg.days} days`);
                }
                return response.json();
            };

            const data= await fetchMarketChart(arg.days);
            const daysHandler=()=>{
                switch (arg.days){
                    case 365:
                        return 'Yearly Time Series';
                    case 30:
                        return 'Monthly Time Series';
                    case 7:
                        return 'Weekly Time Series';
                    default:
                        return `Daily Time Series`;
                }
            }
            // Construct the resulting object
            const category=daysHandler();

            const resultingObject = {
                id:arg.coinId,
                [category]:data
            };
            return resultingObject;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);

// Fetches the list of trending coins
export const getTrendingCoins = createAsyncThunk(
    'trendingCoins',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/coins/trending-coins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch trending coins'); 
            }
            const result = await response.json();
            return result.coins;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);

// Fetches coin details by ID
export const getCoinById = createAsyncThunk(
    'coinById',
    async (arg, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/coins/${arg}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch coin details for ID: ${arg}`); 
            }
            const result = await response.json();
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); 
        }
    }
);
