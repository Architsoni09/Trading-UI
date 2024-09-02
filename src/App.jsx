import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/Pages/Home/Navbar/Navbar.jsx";
import {Home} from "@/Pages/Home/Home.jsx";
import {Portfolio} from "@/Pages/Portfolio/Portfolio.jsx";
import {Activity} from "@/Pages/Activity/Activity.jsx";
import {Wallet} from "@/Pages/Wallet/Wallet.jsx";
import {Withdrawal} from "@/Pages/Withdrawal/Withdrawal.jsx";
import {Profile} from "@/Pages/Profile/Profile.jsx";
import {PaymentDetails} from "@/Pages/Payment/PaymentDetails.jsx";
import {StockDetails} from "@/Pages/StockDetails/StockDetails.jsx";
import {WatchList} from "@/Pages/WatchList/WatchList.jsx";
import {SearchCoin} from "@/Pages/SearchCoin/SearchCoin.jsx";
import {NotFound} from "@/Pages/NotFound/NotFound.jsx";
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import {LogIn} from "lucide-react";
import {SignIn} from "@/Pages/SignIn/SignIn.jsx";
import {Auth} from "@/Pages/Auth/Auth.jsx";
import {useDispatch, useSelector} from "react-redux";
import {isUserSignedInSignIn} from "@/Redux/Slice/Auth/SignInSlice.js";
import {getUserDetails} from "@/Redux/AsyncThunk/Auth/UserDetailsAsyncThunk.js";
import {Toaster} from "react-hot-toast";


function App() {
    const dispatch=useDispatch();
    const isUserSignedIn=useSelector(isUserSignedInSignIn);
    const navigate=useNavigate();
    useEffect(() => {
        if(isUserSignedIn){
            dispatch(getUserDetails());
            navigate('/')
        }
    }, [isUserSignedIn]);
  return (
    <>
        <Toaster />
        {!isUserSignedIn && <Auth/>}
        {isUserSignedIn && <div>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio/>} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoin />} />
            <Route path="/market/:coinId" element={<StockDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<SignIn/>} />
        </Routes>
        </div>}
    </>
  )
}

export default App
