import { Input } from "@/components/ui/input.jsx";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label.jsx";
import free from "/src/assets/Free.png";
import razorpay from "/src/assets/Razorpay.png";
import stripe from "/src/assets/Stripe.png";
import { Button } from "@/components/ui/button.jsx";
import { DialogClose } from "@/components/ui/dialog.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    selectDepositMoneyRequestsError,
    selectDepositMoneyRequestsLoading,
    selectDepositsError,
    selectDepositsLoading,
    selectPaymentId
} from "@/Redux/Slice/Wallet/WalletSlice.js";
import {
    depositToUsersWallet,
    getUserWalletTransactions,
    proceedWithPayment
} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";
import { unwrapResult } from "@reduxjs/toolkit";
import { FaCircle, FaCheckCircle } from 'react-icons/fa'; // Import React Icons

export const TopUpForm = ({onClose}) => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('FREE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const isAnyTopUpLoading = useSelector(selectDepositsLoading);
    const topUpErrors = useSelector(selectDepositsError);
    const paymentId = useSelector(selectPaymentId);
    const depositMoneyRequestLoading = useSelector(selectDepositMoneyRequestsLoading);
    const depositMoneyRequestError = useSelector(selectDepositMoneyRequestsError);

    const handleChange = (event) => {
        setAmount(event.target.value);
    };

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
    };

    const handleSubmit = async () => {
        if (!isAnyTopUpLoading && !isSubmitting) {
            setIsSubmitting(true);

            try {
                const requestBody = { amount: Math.floor(Number(amount)), paymentMethod };
                const result = await dispatch(proceedWithPayment(requestBody));
                const paymentResult = unwrapResult(result);

                if (paymentResult && !topUpErrors) {
                    console.log('Payment Id Generation successful:', paymentResult);

                    if (paymentResult.paymentId) {
                        const finalResult = await dispatch(depositToUsersWallet(paymentResult.paymentId));
                        const depositResult = unwrapResult(finalResult);

                        if (!depositMoneyRequestLoading && !depositMoneyRequestError) {
                            console.log('Top-up successful:', depositResult);
                            setAmount('');
                            setPaymentMethod('FREE');
                            dispatch(getUserWalletTransactions());
                            onClose();
                            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                        } else {
                            console.error('Error during wallet deposit:', depositMoneyRequestError);
                        }
                    }
                } else {
                    console.error('Error in payment process:', topUpErrors);
                }

            } catch (error) {
                console.error('An error occurred during payment processing:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className='pt-10 space-y-5'>
            <div>
                <h1 className='pb-1'>Enter Amount</h1>
                <Input
                    onChange={handleChange}
                    value={amount}
                    className='py-7 text-lg'
                    placeholder="Enter the amount here."
                />
            </div>
            <div>
                <h1 className='pb-1'>Select Payment Method</h1>
                <RadioGroup
                    className='flex'
                    onValueChange={handlePaymentMethodChange}
                    defaultValue='FREE'
                >
                    <div className='flex items-center space-x-2 border p-2 px-5 rounded-md'>
                        <RadioGroupItem
                            icon={isAnyTopUpLoading ? <FaCircle className="text-green-500 animate-spin" /> : <FaCheckCircle className="text-green-500" />}
                            className='h-9 w-9 custom-radio'
                            value='FREE'
                            id='free'
                        />
                        <Label htmlFor='free'>
                            <div className='bg-white flex justify-center items-center rounded-md px-5 py-2 w-32 h-16 overflow-hidden'>
                                <img src={free} alt='Free' />
                            </div>
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2 border p-2 px-5 rounded-md'>
                        <RadioGroupItem
                            icon={isAnyTopUpLoading ? <FaCircle className="text-green-500 animate-spin" /> : <FaCheckCircle className="text-green-500" />}
                            className='h-9 w-9 custom-radio'
                            value='RAZORPAY'
                            id='razorpay'
                            disabled
                        />
                        <Label htmlFor='razorpay'>
                            <div className='bg-white flex justify-center items-center rounded-md px-5 py-2 w-32 h-16 overflow-hidden'>
                                <img src={razorpay} alt='Razorpay' />
                            </div>
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2 border p-2 px-5 rounded-md'>
                        <RadioGroupItem
                            icon={isAnyTopUpLoading ? <FaCircle className="text-green-500 animate-spin" /> : <FaCheckCircle className="text-green-500" />}
                            className='h-9 w-9 custom-radio'
                            value='STRIPE'
                            id='stripe'
                            disabled
                        />
                        <Label htmlFor='stripe'>
                            <div className='bg-white flex justify-center items-center rounded-md px-5 py-2 w-32 h-16 overflow-hidden'>
                                <img src={stripe} alt='Stripe' />
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </div>
                <Button className='w-full py-7 text-xl' onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
        </div>
    );
};
