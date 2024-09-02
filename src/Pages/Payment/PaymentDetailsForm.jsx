import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.jsx";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useDispatch} from "react-redux";
import {addPaymentDetails, getUserPaymentDetails} from "@/Redux/AsyncThunk/Payment/PaymentAsyncThunk.js";
import {unwrapResult} from "@reduxjs/toolkit";
import {useState} from "react";


const schema = z.object({
    accountHolderName: z.string().min(1, 'Account Holder Name is required'),
    ifscCode: z.string().min(1, 'IFSC Code is required'),
    accountNumber: z.string().min(10, 'Account Number is required'),
    confirmAccountNumber: z.string().min(10, 'Confirm Account Number is required'),
    bankName: z.string().min(1, 'Bank Name is required')
}).superRefine((data, ctx) => {
    if (data.accountNumber !== data.confirmAccountNumber) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmAccountNumber'],
            message: "Account numbers don't match",
        });
    }
});


export const PaymentDetailsForm = ({closeDialog}) => {

    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            accountHolderName: '',
            ifscCode: '',
            accountNumber: '',
            confirmAccountNumber: '',
            bankName: '',
        }
    });

    const onSubmit = async (data) => {
        const { confirmAccountNumber, ...responseBody } = data;
        try {
            const result = await dispatch(addPaymentDetails(responseBody)).unwrap();
            if (result) {
                closeDialog();
                dispatch(getUserPaymentDetails());
            }
        } catch (error) {
            setError(error);
        }
    };



    return (
        <div className='px-10 py-2'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 '>
                    <FormField
                        control={form.control}
                        name="accountHolderName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Account Holder Name</FormLabel>
                                <FormControl>
                                    <Input className='border w-full border-gray-700 p-5'
                                           placeholder="Archit soni" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ifscCode"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>IFSC Code</FormLabel>
                                <FormControl>
                                    <Input className='border w-full border-gray-700 p-5'
                                           placeholder="AMIN****" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                    <Input className='border w-full border-gray-700 p-5'
                                           placeholder="********5694" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmAccountNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirm Account Number</FormLabel>
                                <FormControl>
                                    <Input className='border w-full border-gray-700 p-5'
                                           placeholder="Confirm Account number" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bankName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                    <Input className='border w-full border-gray-700 p-5'
                                           placeholder="American Express" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full py-5'>
                        Submit
                    </Button>
                    {error}
                </form>
            </Form>
        </div>
    )
}
