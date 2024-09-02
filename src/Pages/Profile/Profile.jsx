import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge"
import {VerifiedIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.jsx";
import { TwoFactorUpdateForm} from "@/Pages/Profile/TwoFactorUpdateForm.jsx";
import {useSelector} from "react-redux";
import {isTwoFactorEnabledSignIn} from "@/Redux/Slice/Auth/SignInSlice.js";
import {
    selectTwoFactorVerificationStatus,
    selectUserDetails,
    selectUserDetailsError,
    selectUserDetailsLoading
} from "@/Redux/Slice/Auth/UserSlice.js";
import {ProfileUpdateForm} from "@/Pages/Profile/ProfileUpdateForm.jsx";


export const Profile = () => {
    const twoFactorAuthentication=useSelector(selectTwoFactorVerificationStatus);
    const userDetails=useSelector(selectUserDetails);
    const userDetailsLoading=useSelector(selectUserDetailsLoading);
    const userDetailsError=useSelector(selectUserDetailsError);
    const [isAccountVerificationDialogOpen, setIsAccountVerificationDialogOpen] = useState(false);
    const [isProfileUpdateDialogOpen, setIsProfileUpdateDialogOpen] = useState(false);

    if(userDetailsLoading) return (<h1>Loading...</h1>)
    if(userDetailsError) return (<h1>Error: {userDetailsError}</h1>)
    return (
        <div className='flex flex-col items-center mb-5'>
            <div className='pt-10 w-full lg:w-[60%]'>
                <Card>
                    <CardHeader className='pb-5'>
                        <CardTitle>Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-row justify-around mt-5'>
                        <div className='flex flex-col space-y-6'>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Email:</p>
                                <p className='text-gray-400'>{userDetails?.email || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Full Name:</p>
                                <p className='text-gray-400'>{userDetails?.name || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Date of Birth:</p>
                                <p className='text-gray-400'>{userDetails?.dateOfBirth || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Nationality:</p>
                                <p className='text-gray-400'>{userDetails?.nationality || 'NA'}</p>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-6'>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Address:</p>
                                <p className='text-gray-400'>{userDetails?.address || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>City:</p>
                                <p className='text-gray-400'>{userDetails?.city || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Pin Code:</p>
                                <p className='text-gray-400'>{userDetails?.pinCode || 'NA'}</p>
                            </div>
                            <div className='flex'>
                                <p className='w-[9rem] font-semibold text-left'>Country:</p>
                                <p className='text-gray-400'>{userDetails?.country || 'NA'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                    <div className='mt-5'>
                        <Dialog open={isProfileUpdateDialogOpen} onOpenChange={setIsProfileUpdateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button> Add Or Edit Profile Details </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Verify Your Account</DialogTitle>
                                </DialogHeader>
                                <ProfileUpdateForm onClose={()=>setIsProfileUpdateDialogOpen(false)}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                <Card className='mt-6 w-full'>
                    <CardHeader className='pb-5 text-white'>
                        <div className='flex text-white items-center gap-3 '>
                        <CardTitle>Two Factor Authentication</CardTitle>
                            {twoFactorAuthentication? <Badge className='space-x-2 bg-green-500 text-white'>
                             <VerifiedIcon/> Enabled
                            </Badge>:
                            <Badge className='p-1.5 bg-orange-500 text-white'>
                                Disabled
                            </Badge>
                            }
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-row justify-around mt-5'>
                        <div>
                            <Dialog open={isAccountVerificationDialogOpen} onOpenChange={setIsAccountVerificationDialogOpen}>
                                <DialogTrigger asChild>
                                   <Button> {twoFactorAuthentication?'Disable Two Factor Authentication':'Enable Two Factor Authentication'} </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Verify Your Account</DialogTitle>
                                    </DialogHeader>
                                    <TwoFactorUpdateForm onClose={()=>setIsAccountVerificationDialogOpen(false)}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
