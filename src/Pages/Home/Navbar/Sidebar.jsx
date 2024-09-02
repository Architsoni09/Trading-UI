import React from 'react';
import { ActivityLogIcon, BookmarkIcon, DashboardIcon, ExitIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.jsx";
import { SheetClose } from "@/components/ui/sheet.jsx";
import { useNavigate } from "react-router-dom";
import { CreditCardIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearMarketChartError } from "@/Redux/Slice/Coin/CoinsSlice.js";
import {resetUserDetailsErrorsState} from "@/Redux/Slice/Auth/UserSlice.js";
import {resetUserOrdersErrorsState} from "@/Redux/Slice/Order/OrderSlice.js";
import {resetPaymentDetailsErrorState} from "@/Redux/Slice/Payment/PaymentDetailsSlice.js";
import {resetUserWalletErrorsState} from "@/Redux/Slice/Wallet/WalletSlice.js";
import {resetWatchListErrorState} from "@/Redux/Slice/WatchList/WatchListSlice.js";
import {resetUserWithdrawalErrorsState} from "@/Redux/Slice/Withdrawal/WithdrawalSlice.js";

export const Sidebar = (props) => {
    const menu = [
        { name: "Home", path: "/", icon: <HomeIcon className='h-6 w-6' /> },
        { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className='h-6 w-6' /> },
        { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className='h-6 w-6' /> },
        { name: "Activity", path: "/activity", icon: <ActivityLogIcon className='h-6 w-6' /> },
        { name: "Payment", path: "/payment-details", icon: <CreditCardIcon className='h-6 w-6' /> },
        { name: "Wallet", path: "/wallet", icon: <WalletIcon className='h-6 w-6' /> },
        { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className='h-6 w-6' /> },  // Assuming this is a placeholder
        { name: "Profile", path: "/profile", icon: <PersonIcon className='h-6 w-6' /> },
        { name: "Logout", path: "/logout", icon: <ExitIcon className='h-6 w-6' /> },
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    return (
        <div className='mt-10 space-y-5'>
            {menu.map((item, index) => (
                <div key={index} className='mt-10 space-y-5'>
                    <SheetClose asChild>
                        <Button
                            onClick={() => {
                                if (item.name === "Logout") {
                                    handleLogout();
                                } else {
                                    dispatch(clearMarketChartError());
                                    dispatch(resetUserDetailsErrorsState());
                                    dispatch(resetUserOrdersErrorsState());
                                    dispatch(resetPaymentDetailsErrorState());
                                    dispatch(resetUserWalletErrorsState());
                                    dispatch(resetWatchListErrorState());
                                    dispatch(resetUserWithdrawalErrorsState());
                                    navigate(item.path);
                                }
                            }}
                            variant='outline'
                            className='flex items-center justify-center gap-5 py-6 w-full'
                        >
                            <span aria-label='icon'>
                                {item.icon}
                            </span>
                            <p>{item.name}</p>
                        </Button>
                    </SheetClose>
                </div>
            ))}
        </div>
    );
}
