import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { coinsData } from "@/Data/Coins.js";
import {useSelector} from "react-redux";
import {selectAssets, selectAssetsError, selectAssetsLoading} from "@/Redux/Slice/Asset/AssetSlice.js";
import {useNavigate} from "react-router-dom";

export const Portfolio = () => {
    const assets=useSelector(selectAssets);
    const assetLoading=useSelector(selectAssetsLoading);
    const assetError=useSelector(selectAssetsError);
    const navigate=useNavigate();
    // Utility function to get the change class
    const getChangeClass = (value) => {
        return value >= 0 ? 'text-green-500' : 'text-red-500';
    };

    const calculateTotalValue = (quantity, costPrice) => {
        return quantity * costPrice;
    };


    if(assetLoading) return (<div><h1>Loading Your Portfolio..</h1></div>);
    if(assetError) return (<div><h1>Something Went Wrong... Please try again later.</h1></div>)
    return (
        <div className='px-10 lg:p-20 '>
            <h1 className='text-3xl flex font-bold pb-5 items-start'>Portfolio</h1>
            <div style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#6b7280 transparent",}} className='max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>

            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-left'>ASSETS</TableHead>
                    <TableHead className='text-center'>PRICE</TableHead>
                    <TableHead className='text-center'>UNIT</TableHead>
                    <TableHead className='text-center'>CHANGE</TableHead>
                    <TableHead className='text-center'>CHANGE(%)</TableHead>
                    <TableHead className='text-center'>VALUE</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assets.map((asset) => (
                    <TableRow key={asset.id}>
                        <TableCell className="flex items-center gap-2">
                            <Avatar onClick={()=>navigate(`/market/${asset.coin?.id}`)} className="w-10 h-10 cursor-pointer rounded-full">
                                <AvatarImage className='rounded-full' src={asset.coin?.image} alt={`${asset.coin?.name} Logo`} />
                                <AvatarFallback>asset Image</AvatarFallback>
                            </Avatar>
                            <span className="ml-2 font-medium">{asset.coin?.name}</span>
                        </TableCell>
                        <TableCell className='text-center'>${asset.coin?.current_price.toLocaleString()}</TableCell>
                        <TableCell className='text-center'>{asset.quantity}</TableCell>
                        <TableCell className={`text-center ${getChangeClass(asset.coin?.price_change_24h)}`}>
                            ${asset.coin?.price_change_24h.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-center ${getChangeClass(asset.coin?.price_change_percentage_24h)}`}>
                            {asset.coin?.price_change_percentage_24h.toLocaleString()}%
                        </TableCell>
                        <TableCell className='text-center'>
                            ${calculateTotalValue(asset.quantity, asset.coin?.current_price).toLocaleString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
            </div>
        </div>
    );
}
