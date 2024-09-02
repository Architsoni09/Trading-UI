import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import {
    selectFetchAllOrdersForUserData,
    selectFetchAllOrdersForUserError,
    selectFetchAllOrdersForUserLoading
} from "@/Redux/Slice/Order/OrderSlice.js";
import { useEffect } from "react";
import { fetchAllOrdersForUser } from "@/Redux/AsyncThunk/Order/OrderAsyncThunk.js";

export const Activity = () => {

    const orderList = useSelector(selectFetchAllOrdersForUserData);
    const orderListLoading = useSelector(selectFetchAllOrdersForUserLoading);
    const orderListError = useSelector(selectFetchAllOrdersForUserError);
    const dispatch = useDispatch();

    useEffect(() => {
        if (orderList.length === 0) dispatch(fetchAllOrdersForUser());
    }, [orderList.length]);

    const calculateProfitOrLoss = (costPrice, sellingPrice, orderType) => {
        if (orderType === "SELL") {
            return sellingPrice - costPrice;
        }
        return 0; // No profit/loss for BUY orders
    };

    if (orderListLoading) return <p>Loading...</p>;
    if (orderListError) return <><h1>Oops... Something went wrong. Please try again later.</h1></>;
    if (orderList && orderList.length === 0) return <h1>You don't have any recent activity!</h1>;

    return (
        <div className='px-10 lg:p-20'>
            <h1 className='text-3xl font-bold pb-5'>Activity</h1>
            <Table className='border'>
                <TableHeader className='py-5'>
                    <TableRow>
                        <TableHead className="w-1/7 text-center">Date & Time</TableHead>
                        <TableHead className="w-1/7 text-center">Trading Pair</TableHead>
                        <TableHead className="w-1/7 text-center">Buying Price</TableHead>
                        <TableHead className="w-1/7 text-center">Selling Price</TableHead>
                        <TableHead className="w-1/7 text-center">Order Type</TableHead>
                        <TableHead className="w-1/7 text-center">Profit/Loss</TableHead>
                        <TableHead className="w-1/7 text-center">Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orderList.map((order) => {
                        const { timestamp, orderType, orderItem } = order;
                        const {
                            coin: { image, name, symbol },
                            costPrice,
                            sellingPrice,
                            quantity,
                        } = orderItem;

                        const profitOrLoss = calculateProfitOrLoss(costPrice, sellingPrice, orderType);
                        const value = quantity * (orderType === "BUY" ? costPrice : sellingPrice);

                        return (
                            <TableRow key={order.id}>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm">
                                            {new Date(timestamp).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                            })}
                                        </p>
                                        <p className="text-sm">
                                            {new Date(timestamp).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="flex items-center justify-center gap-2 font-medium">
                                    <Avatar className="w-10 h-10 rounded-full">
                                        <AvatarImage className='rounded-full' src={image} alt={`${name} Logo`} />
                                        <AvatarFallback>{symbol}</AvatarFallback>
                                    </Avatar>
                                    <span className="ml-2">{name}</span>
                                </TableCell>
                                <TableCell className="text-center">{costPrice.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{sellingPrice > 0 ? sellingPrice.toLocaleString() : "-"}</TableCell>
                                <TableCell className="text-center">{orderType}</TableCell>
                                <TableCell className={`text-center ${profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {orderType === "SELL" ? profitOrLoss.toFixed(2) : "-"}
                                </TableCell>
                                <TableCell className="text-center">${value.toLocaleString()}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
