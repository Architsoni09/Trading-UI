import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";

export const getUserWalletDetails=createAsyncThunk(
    'wallet/getUserWalletDetails',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/wallet/get-user-wallet`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to User Wallet Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getUserWalletTransactions=createAsyncThunk(
    'wallet/getUserWalletTransactions',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/wallet/transactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to User Wallet Details'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const walletToWalletTransferRequest=createAsyncThunk(
    'wallet/walletToWalletTransferRequest',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/wallet/wallet-transfer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to Execute Wallet Transfer'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const depositToUsersWallet=createAsyncThunk(
    'wallet/depositToUsersWallet',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/wallet/deposit?payment_id=${data}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Deposit money in users Wallet..'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const placeAnOrder=createAsyncThunk(
    'wallet/placeAnOrder',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/wallet/order/${data[orderId]}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Place An Order from user..'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const proceedWithPayment=createAsyncThunk(
    'wallet/proceedWithPayment',
    async (data,thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response = await fetch(`${baseUrl}/api/payment/${data.paymentMethod}/amount/${data.amount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Place An Order from user..'); // error message for clarity
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)