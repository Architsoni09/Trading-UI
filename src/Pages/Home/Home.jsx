import { Button } from "@/components/ui/button.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import { AssetTable } from "@/Pages/Home/AssetTable.jsx";
import { StockChart } from "@/Pages/Home/StockChart.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import bitcoin from './../../assets/Bitcoin.png';
import { CrossIcon, DotIcon, MessageCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import {
    getAllCoinDetails,
    getTop50CoinDetails,
    getTrendingCoins
} from "@/Redux/AsyncThunk/Coin/CoinDetailsAsyncThunk.js";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAllCoins, selectAllCoinsError,
    selectAllCoinsLoading,
    selectTop50Coins, selectTop50CoinsError, selectTop50CoinsLoading,
    selectTopTrendingCoins, selectTopTrendingCoinsError, selectTopTrendingCoinsLoading
} from "@/Redux/Slice/Coin/CoinsSlice.js";

export const Home = () => {
    const [category, setCategory] = useState("all");
    const [inputValue, setInputValue] = useState('');
    const [isBotReleased, setIsBotReleased] = useState(false);
    const [topCoinDetails,setTopCoinDetails] = useState(null);

    // Tools
    const inputRef = useRef();
    const dispatch = useDispatch();

    //All Coins Selectors
    const allCoins = useSelector(selectAllCoins);
    const allCoinsLoading=useSelector(selectAllCoinsLoading);
    const allCoinsError=useSelector(selectAllCoinsError);


    // Top 50 Coins Selectors
    const top50Coins = useSelector(selectTop50Coins);
    const top50CoinsLoading=useSelector(selectTop50CoinsLoading);
    const top50CoinsError=useSelector(selectTop50CoinsError);


    // Trending Coins Selector
    const trendingCoins = useSelector(selectTopTrendingCoins);
    const trendingCoinsLoading = useSelector(selectTopTrendingCoinsLoading);
    const trendingCoinsError = useSelector(selectTopTrendingCoinsError);


    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleReleaseBot = () => {
        setIsBotReleased(!isBotReleased);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed:', inputValue);
            inputRef.current.value = '';
        }
    };

    const handleCategory = (value) => {
        setCategory(value);
    };

    useEffect(() => {
        const fetchData = async () => {
                if (category === 'all') {
                    if (allCoins.length === 0 && allCoinsLoading!==true) {
                        const resultAction = await dispatch(getAllCoinDetails());
                        unwrapResult(resultAction);
                    }
                } else if (category === 'top50') {
                    if (top50Coins.length === 0 && top50CoinsLoading!==true) {
                        const resultAction = await dispatch(getTop50CoinDetails());
                        unwrapResult(resultAction);
                    }
                } else if (category === 'topGainers' || category === 'topLosers') {
                    if (trendingCoins.length === 0 && trendingCoinsLoading!==true) {
                        const resultAction = await dispatch(getTrendingCoins());
                        unwrapResult(resultAction);
                    }
                }
        };
        fetchData();
    }, [category]);

    useEffect(() => {
        setTopCoinDetails(getTopCoinDetailsForTheScenario());
    }, [top50Coins,allCoins,trendingCoins,category]);



    const getCoinData = () => {
        switch (category) {
            case 'top50':
                return top50Coins;
            case 'topGainers':
                return trendingCoins;
            case 'topLosers':
                return [...trendingCoins].reverse();
            case 'all':
            default:
                return allCoins;
        }
    };

    const getTopCoinForTheScenario = () => {
        const allCoinDataArray = getCoinData();
        const topCoinDetails = allCoinDataArray.length > 0 ? allCoinDataArray[0] : {};
        return topCoinDetails.name?topCoinDetails.name.toLocaleLowerCase():'' || (topCoinDetails.item ? topCoinDetails.item.name.toLocaleLowerCase() : '');
    };

    const getTopCoinDetailsForTheScenario = () => {
        const allCoinDataArray = getCoinData();
        const topCoinDetails = allCoinDataArray.length > 0 ? allCoinDataArray[0] : {};
        return topCoinDetails.item?topCoinDetails.item:topCoinDetails;
    };

    return (
        <>
            <div className='relative'>
                <div className='lg:flex'>
                    <div className='lg:w-[50%] lg:border-r'>
                        <div className='p-3 flex items-center gap-4'>
                            <Button onClick={() => handleCategory("all")}
                                    variant={category === "all" ? "default" : "outline"} className='rounded-full'>
                                All
                            </Button>
                            <Button onClick={() => handleCategory("top50")}
                                    variant={category === "top50" ? "default" : "outline"} className='rounded-full'>
                                Top 50
                            </Button>
                            <Button onClick={() => handleCategory("topGainers")}
                                    variant={category === "topGainers" ? "default" : "outline"}
                                    className='rounded-full'>
                                Top Gainers
                            </Button>
                            <Button onClick={() => handleCategory("topLosers")}
                                    variant={category === "topLosers" ? "default" : "outline"} className='rounded-full'>
                                Top Losers
                            </Button>
                        </div>
                        {allCoinsLoading || top50CoinsLoading || trendingCoinsLoading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : Object.keys(getCoinData()).length > 0 ? (
                            <AssetTable
                                coinData={getCoinData()}
                                error={{ allCoinsError, top50CoinsError, trendingCoinsError }}
                                loading={{ allCoinsLoading, top50CoinsLoading, trendingCoinsLoading }}
                                category={category}
                            />
                        ) : (
                            <div className="p-4 text-center">No data available</div>
                        )}
                    </div>
                     <div className='hidden lg:block lg:w-[50%] p-5'>
                         {Object.keys(getTopCoinForTheScenario()).length > 0 ? (
                             <StockChart
                                 coinName={getTopCoinForTheScenario()}
                                 category={category}
                             />
                         ) : top50CoinsLoading || allCoinsLoading || trendingCoinsLoading ? (
                             <div className="p-4 text-center">Loading...</div>
                         ) : (
                             <div className="p-4 text-center">No data available</div>
                         )}
                         {topCoinDetails && Object.keys(topCoinDetails).length > 0 ? (
                             <div className='flex gap-5 items-center'>
                                 <Avatar className="rounded-full">
                                     <AvatarImage
                                         className='rounded-full h-14 w-14'
                                         src={topCoinDetails.large ? topCoinDetails.large : topCoinDetails.image ? topCoinDetails.image : ''}
                                         alt={`Logo`}
                                     />
                                     <AvatarFallback>Coin Image</AvatarFallback>
                                 </Avatar>
                                 <div>
                                     <div className='flex items-center gap-2'>
                                         <p>{topCoinDetails.symbol ? topCoinDetails.symbol : ''}</p>
                                         <DotIcon className='text-gray-400' />
                                         <p className='text-gray-400'>{topCoinDetails.name ? topCoinDetails.name : ''}</p>
                                     </div>
                                     <div className='flex items-end gap-2'>
                                         <p className='text-xl font-bold'>{topCoinDetails.market_cap_rank ? topCoinDetails.market_cap_rank : ''}</p>
                                         <p className={
                                             (topCoinDetails.price_change_percentage_24h !== undefined
                                                 ? topCoinDetails.price_change_percentage_24h
                                                 : topCoinDetails.data?.price_change_percentage_24h?.usd ?? 0) > 0
                                                 ? 'text-green-600'
                                                 : 'text-red-600'
                                         }>
                    <span>
                        {topCoinDetails.price_change_percentage_24h !== undefined
                            ? topCoinDetails.price_change_percentage_24h
                            : topCoinDetails.data?.price_change_percentage_24h?.usd ?? ''}
                    </span>
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         ) : top50CoinsLoading || allCoinsLoading || trendingCoinsLoading ? (
                             <div className="p-4 text-center">Loading...</div>
                         ) : (
                             <div className="p-4 text-center">No data available</div>
                         )}

                    </div>
                </div>

                {/*<section className='fixed bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2'>*/}
                {/*    {isBotReleased && (*/}
                {/*        <div className='rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900'>*/}
                {/*            <div className='flex justify-between items-center border-b px-6 h-[4rem]'>*/}
                {/*                <p>Chat Bot</p>*/}
                {/*                <Button onClick={handleReleaseBot} variant='ghost' size='icon'>*/}
                {/*                    <X />*/}
                {/*                </Button>*/}
                {/*            </div>*/}

                {/*            <div className='h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container'>*/}
                {/*                <div className='self-start pb-5 w-auto'>*/}
                {/*                    <div className='justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto'>*/}
                {/*                        <p>Hi Ram,</p>*/}
                {/*                        <p>How's it going?</p>*/}
                {/*                        <p>Let's catch up soon.</p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className='self-end pb-5 w-auto'>*/}
                {/*                    <div className='justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto'>*/}
                {/*                        <p>Prompt who are you</p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className='self-start pb-5 w-auto'>*/}
                {/*                    <div className='justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto'>*/}
                {/*                        <p>Prompt</p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            <div className='h-[12%] min-w-full w-full border-t'>*/}
                {/*                <Input ref={inputRef} placeholder='write prompt' onChange={handleChange}*/}
                {/*                       onKeyPress={handleKeyPress} value={inputValue}*/}
                {/*                       className='w-full h-full outline-none'/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*    <div className='relative w-[10rem] cursor-pointer group'>*/}
                {/*        <Button onClick={handleReleaseBot} className='w-full h-[3rem] gap-2 items-center'>*/}
                {/*            <MessageCircle size={30}*/}
                {/*                           className='fill-[#1e293b] -rotate-90 stroke-none group-hover:fill-[$1a1a1a]'/>*/}
                {/*            <span className='text-2xl font-bold'>Chat Bot</span>*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*</section>*/}
            </div>
        </>
    );
};
