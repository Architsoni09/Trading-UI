import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import testReducer from "../Slice/Auth/TestSlice.js";
import signUpReducer from "../Slice/Auth/SignUpSlice.js";
import signInReducer from "../Slice/Auth/SignInSlice.js";
import userDetailsReducer from "../Slice/Auth/UserSlice.js";
import coinDetailsReducer from "../Slice/Coin/CoinsSlice.js";
import walletDetailsReducer from "../Slice/Wallet/WalletSlice.js";
import paymentDetailsReducer from "../Slice/Payment/PaymentDetailsSlice.js";
import withdrawalReducer from "../Slice/Withdrawal/WithdrawalSlice.js";
import assetReducer from "../Slice/Asset/AssetSlice.js";
import orderReducer from "../Slice/Order/OrderSlice.js";
import watchlistReducer from "../Slice/WatchList/WatchListSlice.js";
import searchCoinReducer from "../Slice/SearchCoin/SearchCoinSlice.js";
export const store=configureStore({
    reducer: {
        test:testReducer,
        signUp:signUpReducer,
        signIn:signInReducer,
        userDetails:userDetailsReducer,
        coinDetails:coinDetailsReducer,
        userWallet:walletDetailsReducer,
        paymentDetails:paymentDetailsReducer,
        withdrawal:withdrawalReducer,
        asset:assetReducer,
        orders:orderReducer,
        watchlist:watchlistReducer,
        searchCoin:searchCoinReducer,
    },
});