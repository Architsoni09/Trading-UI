import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button.jsx";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import {
    selectWatchlistData,
    selectWatchlistError,
    selectWatchlistLoading
} from "@/Redux/Slice/WatchList/WatchListSlice.js";
import { useEffect } from "react";
import { addCoinToUserWatchList, getUserWatchlistDetails } from "@/Redux/AsyncThunk/WatchList/WatchListAsyncThunk.js";
import {useNavigate} from "react-router-dom";

export const WatchList = () => {
    const watchList = useSelector(selectWatchlistData);
    const watchListLoading = useSelector(selectWatchlistLoading);
    const watchListError = useSelector(selectWatchlistError);
    const dispatch = useDispatch();
    const navigate=useNavigate();

    useEffect(() => {
        if (!watchListLoading && !watchList && !watchListError) {
            dispatch(getUserWatchlistDetails());
        }
    }, [watchList, watchListLoading, watchListError]);


    const handleRemoveFromWatchList = async (coinDetailsByCoinId) => {
        if (coinDetailsByCoinId) {
            try {
                const result = await dispatch(addCoinToUserWatchList(coinDetailsByCoinId.id)).unwrap();
                if (result) {
                    dispatch(getUserWatchlistDetails());
                }
            } catch (err) {
                alert('Not able to remove this coin from the watchlist currently. Please try again later.');
            }
        }
    }

    if (watchListLoading) {
        return <div><h1>Loading your watchlist...</h1></div>;
    }

    if (watchListError) {
        return <div><h1>Error fetching watchlist: {watchListError}</h1></div>;
    }

    if (watchList && watchList.length === 0) {
        return <div className='mt-12'><h1>No coins in your watchlist</h1></div>;
    }

    return (
        <div className='px-10 lg:p-20'>
            <h1 className='text-3xl flex font-bold pb-5 items-start'>Watchlist</h1>
            <div style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#6b7280 transparent",}} className='max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>

            <Table className='border'>
                <TableHeader className='py-5'>
                    <TableRow>
                        <TableHead>COIN</TableHead>
                        <TableHead className="text-right">SYMBOL</TableHead>
                        <TableHead className="text-right">VOLUME</TableHead>
                        <TableHead className="text-right">MARKET CAP</TableHead>
                        <TableHead className="text-right">24 H</TableHead>
                        <TableHead className="text-right">PRICE</TableHead>
                        <TableHead className="text-right text-red-600">REMOVE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {watchList && watchList.map((coin) => (
                        <TableRow key={coin.id}>
                            <TableCell className="flex items-center gap-2 font-medium">
                                <Avatar onClick={()=>navigate(`/market/${coin.id}`)}  className="w-10 h-10 cursor-pointer rounded-full">
                                    <AvatarImage className='rounded-full' src={coin.image} alt={`${coin.name} Logo`} />
                                    <AvatarFallback>Coin Image</AvatarFallback>
                                </Avatar>
                                <span className="ml-2">{coin.name}</span>
                            </TableCell>
                            <TableCell className="text-right">{coin.symbol.toUpperCase()}</TableCell>
                            <TableCell className="text-right">{coin.total_volume.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{coin.market_cap.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{coin.high_24h.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${coin.current_price.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant='outline'
                                    onClick={() => handleRemoveFromWatchList(coin)}
                                    size='icon'
                                    className='h-10 w-10'
                                >
                                    <BookmarkFilledIcon className='w-6 h-6' />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>
    )
}
