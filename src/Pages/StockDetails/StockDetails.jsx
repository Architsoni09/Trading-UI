import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { DotIcon } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {TradingForm} from "@/Pages/StockDetails/TradingForm.jsx";
import {StockChart} from "@/Pages/Home/StockChart.jsx";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { getSpecificCoinDetailsById} from "@/Redux/AsyncThunk/Coin/CoinDetailsAsyncThunk.js";
import {
    selectSpecificCoinDetailsById,
    selectSpecificCoinDetailsError, selectSpecificCoinDetailsLoading
} from "@/Redux/Slice/Coin/CoinsSlice.js";
import {selectWatchlistData} from "@/Redux/Slice/WatchList/WatchListSlice.js";
import {addCoinToUserWatchList, getUserWatchlistDetails} from "@/Redux/AsyncThunk/WatchList/WatchListAsyncThunk.js";

export const StockDetails = () => {
    const [bookmark, setBookmark] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [watchListError,setWatchListError]=useState(null);
    const closeDialog = () => setIsDialogOpen(false);
    const watchList=useSelector(selectWatchlistData);
    const dispatch = useDispatch();
    const { coinId } = useParams();
    const coinDetailsByCoinId = useSelector((state) => selectSpecificCoinDetailsById(state, coinId));
    const coinDetailsByCoinIdLoading=useSelector(selectSpecificCoinDetailsLoading);
    const coinDetailsByCoinIdError=useSelector(selectSpecificCoinDetailsError);

    const handleBookmarkClick = async () => {
        if(coinDetailsByCoinId){
            try{
            const result= await dispatch(addCoinToUserWatchList(coinDetailsByCoinId.id)).unwrap();
            if(result){
                dispatch(getUserWatchlistDetails());
                setBookmark(!bookmark);
                setWatchListError(null);
            }
            }
            catch (err){
                console.log('Not able to add this coin to the watchlist currently please try again later.')
                setWatchListError('Not able to add this coin to the watchlist currently please try again later.');
            }
        }
    };

    useEffect(() => {
        if ( !Object.keys(coinDetailsByCoinId).length > 0 && !coinDetailsByCoinIdLoading) {
            dispatch(getSpecificCoinDetailsById(coinId));
            return;
        }
        if(watchList && watchList.length > 0){
            const isCoinPresent=watchList.some((coins) =>coins.id===coinId);
            if(isCoinPresent){
                setBookmark(true);
            }else{
                setBookmark(false);
            }
        }
    }, []);

    useEffect(() => {
        if(watchList && watchList.length > 0){
            const isCoinPresent=watchList.some((coins) =>coins.id===coinId);
            if(isCoinPresent){
                setBookmark(true);
            }else{
                setBookmark(false);
            }
        }
    }, [watchList]);

    // Render a loading state if data is not yet available
    if (Object.keys(coinDetailsByCoinId).length<1) {
        return <p>Loading...</p>;
    }

    return (
        <div className='p-5 mt-5'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-5 items-center'>
                    <Avatar>
                        <AvatarImage
                            src={coinDetailsByCoinId.image.large|| coinDetailsByCoinId.image || coinDetailsByCoinId.large}
                            alt="Bitcoin"
                        />
                    </Avatar>
                    <div>
                        <div className='flex items-center gap-2'>
                            <p className='font-semibold'>{coinDetailsByCoinId.symbol.toLocaleUpperCase()}</p>
                            <DotIcon className='text-gray-400'/>
                            <p className='text-gray-400'>{coinDetailsByCoinId.name}</p>
                        </div>
                        <div className='flex items-baseline gap-2 mt-1'>
                            <p className='text-xl font-bold'>
                                ${coinDetailsByCoinId.current_price||coinDetailsByCoinId.market_data.current_price.usd}
                            </p>
                            <p>
                               <span> Price Change in past 24 Hrs
                                <span
                                    className={coinDetailsByCoinId.price_change_24h < 0 ? 'text-red-600' : 'text-green-500'}
                                >{coinDetailsByCoinId.price_change_24h || coinDetailsByCoinId.market_data.price_change_24h_in_currency.usd}</span> And </span>
                               <span> Price Change Percentage in past 24 Hrs
                                <span
                                className={coinDetailsByCoinId.price_change_percentage_24h < 0 ? 'text-red-600' : 'text-green-500'}
                            >{coinDetailsByCoinId.price_change_percentage_24h || coinDetailsByCoinId.market_data.price_change_percentage_24h }%</span>
                                   </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-4'>
                    <Button onClick={handleBookmarkClick} variant='outline'>
                        {bookmark ? (
                            <BookmarkFilledIcon className='h-6 w-6'/>
                        ) : (
                            <BookmarkIcon className='h-6 w-6 text-gray-500'/>
                        )}
                    </Button>
                    {watchListError}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild><Button onClick={()=>setIsDialogOpen(true)}>Trade</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>How Much Do You Want To Trade</DialogTitle>
                            </DialogHeader>
                            <TradingForm closeDialog={closeDialog} coinDetailsByCoinId={coinDetailsByCoinId}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className='mt-10'>
                <StockChart coinName={coinId} />
            </div>
        </div>
    );
};

