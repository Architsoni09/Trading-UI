import { Input } from "@/components/ui/input.jsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogClose } from "@/components/ui/dialog.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    selectWalletToWalletTransferRequestsError,
    selectWalletToWalletTransferRequestsLoading
} from "@/Redux/Slice/Wallet/WalletSlice.js";
import {getUserWalletTransactions, walletToWalletTransferRequest} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";
import { unwrapResult } from "@reduxjs/toolkit";

export const TransferForm = ({onClose}) => {
    const [formData, setFormData] = useState({
        amount: '',
        receiverWalletId: '',
        purpose: '',
        transactionType: 'WALLET_TRANSFER',
        date: new Date().toISOString().split('T')[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false); // Add this state to manage submission state

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const dispatch = useDispatch();
    const isAnyWalletToWalletTransferLoading = useSelector(selectWalletToWalletTransferRequestsLoading);
    const WalletToWalletTransferError=useSelector(selectWalletToWalletTransferRequestsError);

    const handleSubmit = async () => {
        if (!isAnyWalletToWalletTransferLoading && !isSubmitting) {
            setIsSubmitting(true); // Set submitting state to true

            try {
                console.log(formData);
                const result = await dispatch(walletToWalletTransferRequest(formData)).unwrap();

                if (!result) {
                    console.log('Oops, something went wrong..!');
                } else {
                    console.log('Transfer successful:', result);
                    setFormData({
                        amount: '',
                        receiverWalletId: '',
                        purpose: '',
                        transactionType: 'WALLET_TRANSFER',
                        date: new Date().toISOString().split('T')[0],
                    });
                    dispatch(getUserWalletTransactions());
                    onClose(); // Close the dialog
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); // Close the dialog
                }
            } catch (error) {
                console.error('An error occurred during wallet transfer:', error);
            } finally {
                setIsSubmitting(false); // Reset submitting state
            }
        }
    };

    return (
        <Dialog>
            <div className='pt-10 space-y-5'>
                <div>
                    <h1 className='pb-1'>Enter Amount</h1>
                    <Input
                        name='amount'
                        onChange={handleChange}
                        value={formData.amount}
                        className={`py-7 text-lg ${formData.amount ? 'bg-white text-slate-800' : 'bg-transparent'}`}
                        placeholder="$9999"
                    />
                </div>
                <div>
                    <h1 className='pb-1'>Enter Wallet ID</h1>
                    <Input
                        name='receiverWalletId'
                        onChange={handleChange}
                        value={formData.receiverWalletId}
                        className={`py-7 text-lg ${formData.receiverWalletId ? 'bg-white text-slate-800' : 'bg-transparent'}`}
                        placeholder="#ADER455"
                    />
                </div>
                <div>
                    <h1 className='pb-1'>Enter Purpose</h1>
                    <Input
                        name='purpose'
                        onChange={handleChange}
                        value={formData.purpose}
                        className={`py-7 text-lg ${formData.purpose ? 'bg-white text-slate-800' : 'bg-transparent'}`}
                        placeholder="Gift for a Friend"
                    />
                </div>
                {WalletToWalletTransferError}
                <DialogClose asChild>
                    <Button onClick={handleSubmit} className='w-full py-7 text-xl' disabled={isSubmitting}>
                        {isSubmitting ? 'Transferring...' : 'Transfer'}
                    </Button>
                </DialogClose>
            </div>
        </Dialog>
    );
};
