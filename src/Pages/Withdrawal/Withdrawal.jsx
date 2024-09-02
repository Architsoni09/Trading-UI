import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {coinsData} from "@/Data/Coins.js";
import {useDispatch, useSelector} from "react-redux";
import {
    selectPaymentDetails,
    selectPaymentDetailsError,
    selectPaymentDetailsLoading
} from "@/Redux/Slice/Payment/PaymentDetailsSlice.js";
import {
    selectUserWithdrawalDetailsData, selectUserWithdrawalDetailsError, selectUserWithdrawalDetailsLoading,
    selectWithdrawalRequestLoading
} from "@/Redux/Slice/Withdrawal/WithdrawalSlice.js";
import {useEffect} from "react";
import {getUserWithdrawalDetails} from "@/Redux/AsyncThunk/Withdrawal/WithdrawalAsyncThunk.js";

export const Withdrawal = () => {
const dispatch=useDispatch();
const withdrawalDetails=useSelector(selectUserWithdrawalDetailsData);
const withdrawalDetailsLoading=useSelector(selectUserWithdrawalDetailsLoading);
const withdrawDetailsError=useSelector(selectUserWithdrawalDetailsError);

    useEffect(() => {
        if(withdrawalDetails.length===0)
        dispatch(getUserWithdrawalDetails());
    }, []);

    if(withdrawalDetailsLoading){
        return <p>Loading...</p>
    }

    if(withdrawDetailsError){
        return <p>Error: {withdrawDetailsError}</p>
    }
    return (
        <>
        <div className='px-10 lg:p-20'>
            <h1 className='text-3xl font-bold pb-5'>Withdrawal</h1>
            <div style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#6b7280 transparent",}} className='max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>

            <Table className='border'>
                <TableHeader className='py-5'>
                    <TableRow>
                        <TableHead className="w-1/6 text-center">Date </TableHead>
                        <TableHead className="w-1/6 text-center">Method</TableHead>
                        <TableHead className="w-1/6 text-center">Amount</TableHead>
                        <TableHead className="w-1/6 text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {withdrawalDetails && withdrawalDetails.length>0 && withdrawalDetails.map((transaction) => (
                        <TableRow key={transaction.id}>
                        <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                                <p className="text-sm">
                                    {new Date(transaction.dateTime).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: '2-digit',
                                    })}
                                </p>
                            </div>
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-2 font-medium">
                            <span className="ml-2">Bank Transfer</span>
                        </TableCell>
                        <TableCell className="text-center">{transaction.amount}</TableCell>
                        <TableCell className='text-center text-white'>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${transaction.withdrawalStatus==='PENDING'?'bg-yellow-400':transaction.withdrawalStatus==='SUCCESS'?'bg-green-500':'bg-red-600'} text-white`}>
                                        {transaction.withdrawalStatus}
                                    </span>
                        </TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
            </div>
        </div>

    </>)
}