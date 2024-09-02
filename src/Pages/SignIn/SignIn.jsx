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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {signedUpUser} from "@/Redux/Slice/Auth/SignUpSlice.js";
import {useEffect, useState} from "react";
import {signUp} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import {userSignIn} from "@/Redux/AsyncThunk/Auth/SignInAsyncThunk.js";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.jsx";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.jsx";
import {
    isTwoFactorEnabledSignIn,
    isUserSignedInSignIn, selectOtpId, selectStatusOfLogin,
    twoFactorAuthenticationStatus
} from "@/Redux/Slice/Auth/SignInSlice.js";
import {twoFactorVerification} from "@/Redux/AsyncThunk/Auth/TwoFactorAsyncThunk.js";
import {unwrapResult} from "@reduxjs/toolkit";

// Define validation schema
const formSchema = z.object({
    email: z.string()
        .nonempty("Email is required")
        .email("Email is not well-formed"),
    password: z.string()
        .nonempty("Password is required")
        .min(8, "Password should be at least 8 characters")
});

export const SignIn = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [isDialogOpen,setIsDialogOpen]=useState(false);
    const [otpValue,setOtpValue]=useState('');
    const otpId=useSelector(selectOtpId);
    const [otpError, setOtpError] = useState('');
    const [signInError, setSignInError] = useState(''); // For handling sign-in error
    const isTwoFactorEnabled=useSelector(isTwoFactorEnabledSignIn);
    const isUserSignedInSuccessfully=useSelector(isUserSignedInSignIn);
    const twoFactorAuthenticationMessage=useSelector(twoFactorAuthenticationStatus);
    const StatusOfLogin=useSelector(selectStatusOfLogin);

    useEffect(() => {
        if(otpId && isTwoFactorEnabled)setIsDialogOpen(true);
        if(isUserSignedInSuccessfully && twoFactorAuthenticationMessage==='Sign In SuccessFull') navigate('/home');
    }, [otpId,StatusOfLogin]);


    useEffect(()=>{
        if(isUserSignedInSuccessfully) navigate('/home');
    },[isUserSignedInSuccessfully])

    const handleTwoStepAuthentication = async () => {
        const data = { otp: otpValue, otpId: otpId };
        try {
            const resultAction = await dispatch(twoFactorVerification(data));
            const result = unwrapResult(resultAction);  // This will throw if the thunk was rejected
            console.log(result);
                setOtpError('');
                setIsDialogOpen(false); // Close the dialog when OTP is correct
            }
        catch (error) {
            setOtpError('Invalid OTP, please try again.');
        }
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data) => {
        setSignInError(''); // Reset error before submitting
        try {
            const resultAction = await dispatch(userSignIn(data));
            unwrapResult(resultAction); // This will throw if the thunk was rejected
        } catch (error) {
            setSignInError("Invalid Credentials Please Try Again"); // Set the error message from the thunk
            form.reset();
        }
    };

    return (
        <>
            <div className='p-4 '>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={form.formState.errors.email ? "text-red-600" : ""}>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input onChange={(e) => {
                                            field.onChange(e);
                                            setSignInError('');
                                        }} className='w-full' placeholder="Enter your email" {...field} />
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
                                        <Input  onChange={(e) => {
                                            field.onChange(e);
                                            setSignInError('');
                                        }} type="password" className='w-full' placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        {signInError && <p className="text-red-600">{signInError}</p>}
                        <Button type="submit"  className='w-full'>
                            Sign In
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
                                <InputOTP onChange={(value) => setOtpValue(value)} maxLength={6}>
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
                                    <Button onClick={handleTwoStepAuthentication} className='w-[10rem]'>
                                        Submit
                                    </Button>
                            </div>
                            {otpError && <p className="text-red-600">{otpError}</p>}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
}
