import React, {useEffect, useRef, useState} from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    DragHandleHorizontalIcon, MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import bitcoin from "/src/assets/Bitcoin.png";
import dp from "/src/assets/Dp.svg";
import { Sidebar } from "@/Pages/Home/Navbar/Sidebar.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {useDispatch, useSelector} from "react-redux";
import { selectUserName} from "@/Redux/Slice/Auth/UserSlice.js";
import {getUserDetails} from "@/Redux/AsyncThunk/Auth/UserDetailsAsyncThunk.js";
import {getUserPaymentDetails} from "@/Redux/AsyncThunk/Payment/PaymentAsyncThunk.js";
import {getUserWalletDetails, getUserWalletTransactions} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";
import {getAllUserAssets} from "@/Redux/AsyncThunk/Asset/AssetAsyncThunk.js";
import {useNavigate} from "react-router-dom";
import {Input} from "@/components/ui/input.jsx";
import {selectSearchData, selectSearchError, selectSearchLoading} from "@/Redux/Slice/SearchCoin/SearchCoinSlice.js";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {SearchCoin} from "@/Pages/SearchCoin/SearchCoin.jsx";
import {getSearchDetails} from "@/Redux/SearchCoins/SearchCoinAsyncThunk.js";

const coins = [
    {
        id: "bitcoin",
        name: "Bitcoin",
        api_symbol: "bitcoin",
        symbol: "BTC",
        market_cap_rank: 1,
        thumb: "https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png",
        large: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png"
    },
    {
        id: "ethereum",
        name: "Ethereum",
        api_symbol: "ethereum",
        symbol: "ETH",
        market_cap_rank: 2,
        thumb: "https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png",
        large: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png"
    },
    // Add more coin objects here
];

function Navbar(props) {
const dispatch=useDispatch();
const userName=useSelector(selectUserName);
const navigate=useNavigate();
const [isPopOverExpanded,setIsPopOverExpanded]=useState(false);
const searchData=useSelector(selectSearchData);
const searchDataLoading=useSelector(selectSearchLoading);
const searchDataError=useSelector(selectSearchError);
const searchInput=useRef();
    useEffect(() => {
        dispatch(getUserPaymentDetails());
        dispatch(getUserWalletTransactions());
        dispatch(getUserWalletDetails());
        dispatch(getAllUserAssets());
    }, []);

    const onClose=()=>setIsPopOverExpanded(false);

    const searchHandler = async () => {
      const searchValue=searchInput.current?.value.toLocaleString().trim();
        if (searchValue) {
            const result= await  dispatch(getSearchDetails(searchValue)).unwrap();
            if(result){
                console.log('Search coins result:', result);
            }
            setIsPopOverExpanded(true);
        }
    }


    return (
        <div className='px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
                <Sheet>
                    <SheetTrigger asChild>
                        <div
                            className='flex justify-center items-center p-2 bg-hsl(var(--border)) hover:bg-accent hover:text-accent-foreground rounded-full hover:bg-opacity-80 transition-colors'>
                            <DragHandleHorizontalIcon className="h-5 w-5"/>
                        </div>
                    </SheetTrigger>
                    <SheetContent
                        className='w-auto border-r-0 flex flex-col justify-around'
                        side='left'
                        aria-describedby="sheet-description"
                    >
                        <SheetHeader>
                            <SheetTitle>
                                <div className='flex text-2xl justify-between items-center gap-2'>
                                    <Avatar style={{width: "25%"}}
                                            className='h-16 flex flex-row justify-center text-center rounded-full'>
                                        <AvatarImage src={bitcoin} alt="Bitcoin Logo"
                                                     className='object-cover rounded-full'/>
                                    </Avatar>
                                    <div style={{width: "75%"}} className='flex flex-row justify-center text-center'>
                                        <span className='font-bold text-orange-700'>Crypto</span>
                                        <span className='font-medium'>Trading</span>
                                    </div>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <div id="sheet-description" className="sr-only">
                            This is the description for the sidebar content. It provides additional information about
                            the items in the sidebar.
                        </div>
                        <ScrollArea className='p-4'>
                            <Sidebar/>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <p className='text-sm lg:text-base cursor-pointer'>
                    Crypto Trading
                </p>
                <div className="p-0 ml-9 flex items-center gap-2">
                    <Popover open={isPopOverExpanded} onOpenChange={setIsPopOverExpanded}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <MagnifyingGlassIcon onClick={searchHandler} className="h-5 w-5"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className=' p-0 ml-[30%] mt-[1%]'>
                                <div style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#6b7280 transparent",
                                }} className="flex max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 justify-between items-center flex-col">
                                    {searchData.length > 0 ? searchData.map((coin) => (
                                        <SearchCoin onClose={onClose} key={coin.id} coin={coin} />
                                    )) : <h1>Not Able To Find Any Related Coins</h1>}
                                </div>
                        </PopoverContent>
                    </Popover>
                    <Input type="text" placeholder="Search" className="flex-grow" ref={searchInput}/>
                </div>
            </div>
            <div>
                <Avatar onClick={() => navigate('/profile')} style={{width: "100%"}}
                        className='h-12 flex cursor-pointer flex-row justify-center text-center rounded-full'>
                    <AvatarImage src={dp} alt="Profile Picture" className='object-cover rounded-full'/>
                </Avatar>
                {userName}
            </div>
        </div>
    );
}

export default Navbar;
