import "./Auth.css";
import {SignUp} from "@/Pages/SignUp/SignUp.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useNavigate} from "react-router-dom";
import {ForgotPassword} from "@/Pages/ForgotPassword/ForgotPassword.jsx";
import {LogIn} from "lucide-react";
import {SignIn} from "@/Pages/SignIn/SignIn.jsx";
import {useDispatch, useSelector} from "react-redux";
import {testSelector} from "@/Redux/Slice/Auth/TestSlice.js";
import {useEffect} from "react";
import {test} from "@/Redux/AsyncThunk/Auth/TestAsyncThunk.js";
import {clearState, signedUpUser} from "@/Redux/Slice/Auth/SignUpSlice.js";

export const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <>
            <div className='h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center authContainer'>
                <div className='absolute top-0 right-0 left-0 bottom-0 bg-[#040712] bg-opacity-50'>
                    <div
                        style={{ backdropFilter: 'blur(10px)' }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center h-[40rem] w-[30rem] rounded-md z-50 bg-black bg-opacity-70 shadow-[0_4px_6px_rgba(0,0,0,0.3)] border border-gray-700"
                    >
                    <h1 className='text-6xl font-bold '>Crypto Trading</h1>
                    {location.pathname === '/sign-up' ? <section className='w-full'>
                        <SignUp/>
                        <div className='items-center flex justify-center'>
                                <span className='px-2'>Already Registered?</span>
                                <Button className='w-auto' onClick={()=>navigate('/sign-in')} variant='ghost'>SignIn</Button>
                            </div>
                        </section>:location.pathname==='/forgot-password'? <section className='w-full'>
                                <ForgotPassword/>
                                <div className='items-center flex justify-center'>
                                    <span>Want To Sign In?</span>
                                    <Button className='w-auto' onClick={() => navigate('/sign-in')} variant='ghost'>SignIn</Button>
                                </div>
                            </section> :
                            <section className='w-full'>
                                <SignIn/>
                                <div className='items-center flex justify-center'>
                                    <span>Want To Register?</span>
                                    <Button onClick={() => navigate('/sign-up')} variant='ghost'>SignUp</Button>
                                </div>
                                <div className='items-center flex justify-center'>
                                    <Button className='w-auto py-5'
                                        onClick={() => navigate('/forgot-password')} variant='outline'>Forgot Password</Button>
                                </div>
                            </section>}
                    </div>
                </div>
            </div>
        </>
    );
};
