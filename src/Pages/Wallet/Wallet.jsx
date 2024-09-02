import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { DollarSign, ShuffleIcon, UploadIcon, WalletIcon } from "lucide-react";
import { CopyIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog.jsx";
import { TopUpForm } from "@/Pages/Wallet/TopUpForm.jsx";
import { WithdrawalForm } from "@/Pages/Wallet/WithdrawalForm.jsx";
import { TransferForm } from "@/Pages/Wallet/TransferForm.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    selectUserWalletDetails,
    selectUserWalletDetailsError,
    selectUserWalletDetailsLoading,
    selectWalletTransactions,
    selectWalletTransactionsError,
    selectWalletTransactionsLoading
} from "@/Redux/Slice/Wallet/WalletSlice.js";
import { getUserWalletDetails, getUserWalletTransactions } from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";
import { Button } from "@/components/ui/button.jsx";

export const Wallet = () => {
    const dispatch = useDispatch();
    const userWalletDetails = useSelector(selectUserWalletDetails);
    const userWalletDetailsLoading = useSelector(selectUserWalletDetailsLoading);
    const userWalletDetailsError = useSelector(selectUserWalletDetailsError);
    const userTransactionDetails = useSelector(selectWalletTransactions);
    const userTransactionDetailsLoading = useSelector(selectWalletTransactionsLoading);
    const userTransactionDetailsError = useSelector(selectWalletTransactionsError);

    const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
    const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getUserWalletDetails());
        dispatch(getUserWalletTransactions());
    }, [dispatch]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard successfully!');
            })
            .catch((err) => {
                console.error('Failed to copy text to clipboard:', err);
            });
    };

    if (userWalletDetailsLoading) return <div>Loading...</div>;

    return (
        <div className='flex flex-col items-center'>
            <div className='pt-10 w-full lg:w-[60%]'>
                {!Object.keys(userWalletDetails).length < 1 &&
                    <Card>
                        <CardHeader className='pb-9'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-5'>
                                    <WalletIcon size='28' />
                                    {userWalletDetailsError ? <h1 className='text-red-600'>Please Refresh, Something went wrong fetching the details</h1> :
                                        <div>
                                            <CardTitle className='text-2xl'>{userWalletDetails.user.name}'s Wallet</CardTitle>
                                            <div className='flex items-center gap-2'>
                                                <p className='text-gray-200 text-sm'>Wallet Id: {userWalletDetails.id}</p>
                                                <CopyIcon onClick={() => copyToClipboard(userWalletDetails.id)} size={15} className='cursor-pointer hover:text-slate-300' />
                                            </div>
                                        </div>}
                                </div>
                                <ReloadIcon onClick={() => dispatch(getUserWalletDetails())} className='w-6 h-6 cursor-pointer hover:text-gray-400' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-center'>
                                <span className='text-2xl font-semibold'>Available Balance:</span>
                            </div>
                            <div className='flex items-center'>
                                <DollarSign />
                                <span className='text-2xl font-semibold'> {userWalletDetails.balance}</span>
                            </div>
                            <div className='flex gap-7 mt-5'>
                                <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
                                    <DialogTrigger asChild>
                                        <div className='h-24 w-24 hover:text-gray-400 flex flex-col items-center justify-center rounded-md shadow-slate-800 shadow-md cursor-pointer'>
                                            <UploadIcon />
                                            <span className='text-sm mt-2'>Add Money</span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className='max-w-[50%] min-w-[40%] w-auto h-auto'>
                                        <DialogHeader>
                                            <DialogTitle className='text-center text-xl'>Top up Your Wallet</DialogTitle>
                                        </DialogHeader>
                                        <TopUpForm onClose={() => setIsTopUpDialogOpen(false)} />
                                        <DialogClose className='w-full'>
                                            <Button onClick={() => setIsTopUpDialogOpen(false)} className='w-full py-7 text-xl'>
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
                                    <DialogTrigger asChild>
                                        <div className='h-24 w-24 hover:text-gray-400 flex flex-col items-center justify-center rounded-md shadow-slate-800 shadow-md cursor-pointer'>
                                            <UploadIcon />
                                            <span className='text-sm mt-2'>Withdraw</span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className='max-w-[50%] min-w-[40%] w-auto h-auto'>
                                        <DialogHeader>
                                            <DialogTitle className='text-center text-xl'>Request Withdrawal</DialogTitle>
                                        </DialogHeader>
                                        <WithdrawalForm onClose={() => setIsWithdrawalDialogOpen(false)} />
                                        <DialogClose className='w-full'>
                                            <Button onClick={() => setIsWithdrawalDialogOpen(false)} className='w-full py-7 text-xl'>
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                                    <DialogTrigger asChild>
                                        <div className='h-24 w-24 hover:text-gray-400 flex flex-col items-center justify-center rounded-md shadow-slate-800 shadow-md cursor-pointer'>
                                            <ShuffleIcon />
                                            <span className='text-sm mt-2'>Transfer</span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className='max-w-[50%] min-w-[40%] w-auto h-auto'>
                                        <DialogHeader>
                                            <DialogTitle className='text-center text-xl'>Transfer to Other Wallet</DialogTitle>
                                        </DialogHeader>
                                        <TransferForm onClose={() => setIsTransferDialogOpen(false)} />
                                        <DialogClose className='w-full'>
                                            <Button onClick={() => setIsTransferDialogOpen(false)} className='w-full py-7 text-xl'>
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                }
                <div className='py-5 pt-10'>
                    <div className='flex gap-2 items-center pb-5'>
                        <h1 className='text-2xl font-semibold'>History</h1>
                        <UpdateIcon onClick={() => dispatch(getUserWalletTransactions())} className='h-7 w-7 p-0 cursor-pointer hover:text-gray-400' />
                    </div>
                    <div className='space-y-5'>
                        <div style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#6b7280 transparent",
                        }}
                             className='max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>
                            {userTransactionDetailsLoading && <h1>Loading...</h1>}
                            {userTransactionDetailsError && <h1>Oops, something went wrong. Try again later.</h1>}
                            {!userTransactionDetailsError && !userTransactionDetailsLoading && userTransactionDetails.length === 0 &&
                                <h1>No transactions have been made by the user so far.</h1>}
                            {userTransactionDetails.map((item, index) => (
                                <Card key={index} className='px-5 py-3 flex justify-between items-center'>
                                    <div className='flex items-center gap-5 flex-grow'>
                                        <div className='flex-shrink-0 w-[25%]'>
                                            <Avatar>
                                                <AvatarFallback>
                                                    <ShuffleIcon/>
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className='flex-grow w-[50%]'>
                                            <h1 className='text-lg font-semibold truncate'>{item.purpose}</h1>
                                            <p className='text-sm text-gray-500'>{item.date}</p>
                                        </div>
                                        <div className='flex-shrink-0 w-[25%] flex flex-row-reverse'>
                                            <p className={`${userWalletDetails.id === item.receiverWalletId ? (item.purpose === 'Withdraw To Bank Account' || item.purpose === 'Asset Purchase') ? 'text-red-600' : 'text-green-500' : 'text-red-600'} font-semibold`}>
                                                {userWalletDetails.id === item.receiverWalletId ? '+' : '-'} $ {item.amount}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
