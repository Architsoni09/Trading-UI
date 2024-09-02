import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {signUp} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useEffect, useState} from "react";
import {isAccountActivated, isUserVerificationOtpSent, signUpError} from "@/Redux/Slice/Auth/SignUpSlice.js";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.jsx";
import {activateAccount} from "@/Redux/AsyncThunk/Auth/AccountActivationAsyncThunk.js";
import {unwrapResult} from "@reduxjs/toolkit";


const formSchema = z.object({
    userName: z.string().nonempty("User name is required").min(1, "No blank spaces should be there"),
    mobileNumber: z.string()
        .nonempty("Mobile number is required")
        .min(10, "Mobile number should be at least 10 characters").max(10, "Mobile number should be at Max 10 characters"),
    email: z.string().nonempty("Email is required").email("Email is not well-formed"),
    password: z.string()
        .nonempty("Password is required")
        .min(8, "Password should be at least 8 characters"),
    isTwoFactorEnabled: z.boolean().optional(),
});

export const SignUp = () => {

    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [isDialogOpen,setIsDialogOpen]=useState(false);
    const isOtpSent=useSelector(isUserVerificationOtpSent);
    const signUpErrorBoolean=useSelector(signUpError);
    const [otpError, setOtpError] = useState('');
    const isAccountActivatedBoolean=useSelector(isAccountActivated);
    const [otp,setOtp]=useState(null);
    const [email,setEmail]=useState('');


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: '',
            mobileNumber: '',
            email: '',
            password: '',
            isTwoFactorEnabled: false,
        }
    });

    const onSubmit = async (data) => {
        try {
            const resultAction = await dispatch(signUp(data));
            const x=unwrapResult(resultAction); // This will throw if the thunk was rejected
            setEmail(data.email);
        } catch (error) {
            form.reset();
        }
    };

    const handleAccountActivation = async () => {
        try {
            const otpObject = { email, activationCode: otp };
            const resultAction = await dispatch(activateAccount(otpObject));
             const result = unwrapResult(resultAction); // This will throw if the thunk was rejected
            if(!result) throw new Error();
            console.log('Account activated successfully:', otpObject);

        } catch (error) {
            console.error('Failed to activate account:', error);
            setOtpError('Failed to activate account. Please check your OTP and try again.');
            setOtp('');
        }
    };

    useEffect(() => {
        if(isOtpSent)setIsDialogOpen(true);
    }, [isOtpSent]);

    useEffect(() => {
        if(isAccountActivatedBoolean){
            navigate('/sign-in');
        }
    }, [isAccountActivatedBoolean]);

    return (
        <>
            <div className='p-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={form.formState.errors.userName ? "text-red-600" : ""}>
                                        User Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input className='w-full' placeholder="Enter your user name" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobileNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={form.formState.errors.mobileNumber ? "text-red-600" : ""}>
                                        Mobile Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input className='w-full' placeholder="Enter your mobile number" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={form.formState.errors.email ? "text-red-600" : ""}>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input className='w-full' placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={form.formState.errors.password ? "text-red-600" : ""}>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" className='w-full' placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-700"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            id="isTwoFactorEnabled"
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                        />
                                    </FormControl>
                                    <FormLabel htmlFor="isTwoFactorEnabled" className={form.formState.errors.isTwoFactorEnabled ? "text-red-600" : ""}>
                                        Enable Two-Factor Authentication
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>
                            Submit
                        </Button>
                    </form>
                </Form>
                {isDialogOpen && (
                    <Dialog asChild open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Send OTP</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enter OTP</DialogTitle>
                                </DialogHeader>
                                <div className='py-5 gap-10 flex justify-center items-center'>
                                    <InputOTP onChange={(value) => setOtp(value)} maxLength={6}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                        <Button onClick={handleAccountActivation} className='w-[10rem]'>
                                            Submit
                                        </Button>
                                </div>
                                {otpError && <p className="text-red-600">{otpError}</p>}
                            </DialogContent>
                        </Dialog>
                )}
                {signUpErrorBoolean&&<h1>The User is already signed up kindly proceed to login page.</h1>}
            </div>
        </>
    );
}
