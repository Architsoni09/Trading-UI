import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.jsx";
import { PaymentDetailsForm } from "@/Pages/Payment/PaymentDetailsForm.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    selectPaymentDetails,
    selectPaymentDetailsError,
    selectPaymentDetailsLoading,
} from "@/Redux/Slice/Payment/PaymentDetailsSlice.js";
import {getUserPaymentDetails} from "@/Redux/AsyncThunk/Payment/PaymentAsyncThunk.js";

export const PaymentDetails = () => {
    const dispatch=useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const closeDialog = () => setIsDialogOpen(false);
    const isThereAnyPaymentDetailsError = useSelector(selectPaymentDetailsError);
    const isThereAnyPaymentDetailsLoading = useSelector(selectPaymentDetailsLoading);
    const paymentDetails = useSelector(selectPaymentDetails);


    return (
        <div className="px-20">
            <h1 className="text-3xl font-bold py-10">Payment Details</h1>
            {isThereAnyPaymentDetailsError !== "Payment details not found." &&
            !isThereAnyPaymentDetailsLoading &&
            Object.keys(paymentDetails).length >0 ? (
                <Card>
                    <CardHeader className="flex text-left">
                        <CardTitle>{paymentDetails.bankName}</CardTitle>
                        <CardDescription>A/C No : ******{paymentDetails.accountNumber.substring(paymentDetails.accountNumber.length-4)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex text-left flex-col">
                        <div className="flex items-center">
                            <p className="w-32">A/C Holder</p>
                            <p className="text-gray-400">: {paymentDetails.accountHolderName}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="w-32">IFSC</p>
                            <p className="text-gray-400">: {paymentDetails.ifscCode}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : isThereAnyPaymentDetailsError && !isThereAnyPaymentDetailsLoading && Object.keys(paymentDetails).length <1 ? (
                <p className="text-gray-500">No payment details found.</p>
            ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-4 py-6" onClick={() => setIsDialogOpen(true)}>
                            Add Payment Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <PaymentDetailsForm closeDialog={closeDialog} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
