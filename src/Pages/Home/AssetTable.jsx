import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {clearMarketChartError} from "@/Redux/Slice/Coin/CoinsSlice.js";

export const AssetTable = (props) => {
    const { coinData, loading, error, category } = props;
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const errorMatcher=()=>{
        switch (category){
            case 'topGainers':
                return 'trendingCoinsError';
            case 'topLosers':
                return 'trendingCoinsError';
            case 'top50':
                return 'top50CoinsError';
            case 'all':
                return 'allCoinsError';
            default:
                return 'allCoinsError';
        }
    }
    const loadingMatcher=()=>{
        switch (category){
            case 'topGainers':
                return 'trendingCoinsLoading';
            case 'topLosers':
                return 'trendingCoinsLoading';
            case 'top50':
                return 'top50CoinsLoading';
            case 'all':
                return 'allCoinsLoading';
            default:
                return 'allCoinsLoading';
        }
    }

    const [currentError,setCurrentError] =useState(()=>errorMatcher());
    const [currentLoading, setCurrentLoading] = useState(()=>loadingMatcher());



    useEffect(() => {
        setCurrentLoading(loadingMatcher());
        setCurrentError(errorMatcher());
    }, [category]);



    if (loading[currentLoading]===true) return <div>Loading...</div>;
    if (error[currentError] || (!loading[currentLoading] && (!coinData || coinData.length === 0))) {
        return <h2>Error: {error[currentError] || 'No data available'}</h2>;
    }

    return (

        <div style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#6b7280 transparent",}} className='max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>COIN</TableHead>
                    <TableHead className="text-right">SYMBOL</TableHead>
                    <TableHead className="text-right">VOLUME</TableHead>
                    <TableHead className="text-right">MARKET CAP</TableHead>
                    <TableHead className="text-right">
                        {category === 'topGainers' || category === 'topLosers' ? 'SCORE' : 'HIGH 24H'}
                    </TableHead>
                    <TableHead className="text-right">
                        {category === 'topGainers' || category === 'topLosers' ? 'MARKET CAP RANK' : 'PRICE'}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {coinData.map((coin) => (
                    <TableRow key={coin.id}>
                        <TableCell
                            onClick={() => {
                                dispatch(clearMarketChartError);
                                navigate(`/market/${coin.id ? coin.id : coin.item.id}/`);
                            }
                            }
                            className="flex items-center gap-2 font-medium"
                        >
                            <Avatar className="w-10 cursor-pointer h-10 rounded-full">
                                <AvatarImage
                                    className="rounded-full"
                                    src={
                                        category === 'topGainers' || category === 'topLosers'
                                            ? coin.item.large
                                            : coin.image
                                    }
                                    alt={`${
                                        category === 'topGainers' || category === 'topLosers'
                                            ? coin.item.name
                                            : coin.name
                                    } Logo`}
                                />
                                <AvatarFallback>Coin Image</AvatarFallback>
                            </Avatar>
                            <span className="ml-2">
                                {category === 'topGainers' || category === 'topLosers' ? coin.item.name : coin.name}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            {category === 'topGainers' || category === 'topLosers'
                                ? coin.item.symbol?.toUpperCase() || 'N/A'
                                : coin.symbol?.toUpperCase() || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                            {category === 'topGainers' || category === 'topLosers'
                                ? coin.item.data.total_volume?.toLocaleString() || 'N/A'
                                : coin.total_volume?.toLocaleString() || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                            {category === 'topGainers' || category === 'topLosers'
                                ? coin.item.data.market_cap?.toLocaleString() || 'N/A'
                                : coin.market_cap?.toLocaleString() || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                            {category === 'topGainers' || category === 'topLosers'
                                ? coin.item.score?.toLocaleString() || 'N/A'
                                : coin.high_24h?.toLocaleString() || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                            {category === 'topGainers' || category === 'topLosers'
                                ? coin.item.market_cap_rank?.toLocaleString() || 'N/A'
                                : `$${coin.current_price?.toLocaleString() || 'N/A'}`}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
};
