import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectTwoFactorVerificationStatus} from "@/Redux/Slice/Auth/UserSlice.js";
import {updateUserDetails} from "@/Redux/AsyncThunk/Auth/UserDetailsAsyncThunk.js";
import {toast} from "react-hot-toast";
import {editTwoFactorVerification} from "@/Redux/AsyncThunk/Auth/TwoFactorAsyncThunk.js";

export const TwoFactorUpdateForm = (props) => {
    const {onClose} = props;
    const twoFactorAuthentication=useSelector(selectTwoFactorVerificationStatus);
    const dispatch=useDispatch();

    const handleConfirm = async () => {
        if(twoFactorAuthentication){
           const result= dispatch(editTwoFactorVerification('disable')).unwrap();
            if(result) {
                 toast.success('Two-factor authentication updated successfully');
                 onClose();
            }
            else{
                toast.error('Unable to update user details. Please try again');
            }
        }
        else{
            const result= dispatch(editTwoFactorVerification('enable')).unwrap();
            if(result) {
                toast.success('Two-factor authentication updated successfully');
                onClose();
            }
            else{
                toast.error('Unable to update user details. Please try again');
            }
        }
    };

    const handleCancel = () => {
        onClose();
    };


    return (
        <>
            <p className='text-lg'>Are you sure you want to continue?</p>
            <div className='flex justify-end space-x-4 mt-4'>
                <Button variant='secondary' onClick={handleCancel}>No</Button>
                <Button variant='primary' onClick={handleConfirm}>Yes</Button>
            </div>
        </>
    );
};
