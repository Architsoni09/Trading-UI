import { useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import bank from '/src/assets/Bank.png';
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    selectUserWalletDetails
} from "@/Redux/Slice/Wallet/WalletSlice.js";
import {
    selectPaymentDetails,
    selectPaymentDetailsError,
} from "@/Redux/Slice/Payment/PaymentDetailsSlice.js";
import {
    adminWithdrawalRequest,
    getUserWithdrawalDetails,
    userWithdrawalRequest
} from "@/Redux/AsyncThunk/Withdrawal/WithdrawalAsyncThunk.js";
import {
    selectAdminRequestData, selectAdminRequestError, selectAdminRequestLoading,
    selectWithdrawalRequestData,
    selectWithdrawalRequestError,
    selectWithdrawalRequestLoading
} from "@/Redux/Slice/Withdrawal/WithdrawalSlice.js";
import {getUserWalletDetails, getUserWalletTransactions} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";

export const WithdrawalForm = ({onClose}) => {
    const [amount, setAmount] = useState('');
    const dispatch=useDispatch();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const userWalletDetails = useSelector(selectUserWalletDetails);
    const paymentDetails = useSelector(selectPaymentDetails);
    const paymentDetailsError = useSelector(selectPaymentDetailsError);
    const [error,setError]=useState(null);

    const withdrawalRequestData = useSelector(selectWithdrawalRequestData);
    const withdrawalRequestLoading = useSelector(selectWithdrawalRequestLoading);
    const withdrawalRequestError = useSelector(selectWithdrawalRequestError);

    const adminRequestData = useSelector(selectAdminRequestData);
    const adminRequestLoading = useSelector(selectAdminRequestLoading);
    const adminRequestError = useSelector(selectAdminRequestError);

    const handleChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const result = await dispatch(userWithdrawalRequest(amount)).unwrap();
            if(result){
                console.log('Withdrawal request generation successful:', result);
                dispatch(getUserWithdrawalDetails());
                setIsConfirmationOpen(true);
            }
        } catch (error) {
            // Handle the error here
            console.error('Withdrawal generation failed:', error);
            setError(error);
        }
    };

    const handleConfirm = async () => {
        try {
            if(withdrawalRequestData.id!==''){
            const result = await dispatch(adminWithdrawalRequest(withdrawalRequestData.id)).unwrap();
            if(result){
                console.log('Withdrawal completely successful:', result);
                setIsConfirmationOpen(false);
                setAmount('');
                dispatch(getUserWalletDetails());
                dispatch(getUserWalletTransactions());
                dispatch(getUserWithdrawalDetails());
                onClose();
            }
            }
        } catch (error) {
            // Handle the error here
            console.error('Withdrawal processing failed:', error);
            setError(error);
            setIsConfirmationOpen(false);
        }
    };

    const handleCancel = () => {
        setIsConfirmationOpen(false);
    };

    if (paymentDetailsError && paymentDetailsError !== 'Payment details not found.' && Object.keys(paymentDetails).length < 1) {
        return <p>Error fetching payment details</p>;
    }

    return (
        <>
            {paymentDetailsError === 'Payment details not found.' ? (
                <div className='pt-10 text-center'>
                    <h1 className='text-xl font-bold'>Please add payment details before using this feature.</h1>
                </div>
            ) : (
                <div className='pt-10 space-y-5'>
                    <div className='flex justify-between items-center rounded-md bg-slate-900 text-xl font-bold px-5 py-4'>
                        <p>Available Balance</p>
                        <p>$ {userWalletDetails.balance}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-xl font-bold'>Enter Withdrawal Amount</h1>
                        <Input
                            onChange={handleChange}
                            value={amount}
                            className='py-7 border-neutral-50 outline-none text-xl text-center'
                            placeholder='$9999'
                            type='number'
                        />
                    </div>
                    <div>
                        <p className='pb-2 text-xl font-bold'>Transfer To</p>
                        <div className='flex items-center gap-5 border px-5 py-2 rounded-md'>
                            <img className='h-10 w-10' src={bank} alt='Bank logo'/>
                            <div>
                                <p className='text-xl font-bold'>{paymentDetails.bankName}</p>
                                <p className='text-xs'>******{paymentDetails.accountNumber.substring(paymentDetails.accountNumber.length-4)}</p>
                            </div>
                        </div>
                    </div>
                    {error}
                    <Button onClick={handleSubmit} className='w-full py-7 text-xl'>
                        Withdraw
                    </Button>

                    {/* Confirmation Dialog */}
                    <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
                        {isConfirmationOpen && <DialogTitle>Confirm Withdrawal</DialogTitle>}
                        <DialogContent>
                            <p className='text-lg'>Are you sure you want to continue?</p>
                            <div className='flex justify-end space-x-4 mt-4'>
                                <Button variant='secondary' onClick={handleCancel}>No</Button>
                                <Button variant='primary' onClick={handleConfirm}>Yes</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </>
    );
};
