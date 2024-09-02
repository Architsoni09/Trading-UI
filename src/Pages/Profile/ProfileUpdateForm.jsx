import { Input } from "@/components/ui/input.jsx";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Dialog } from "@/components/ui/dialog.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, isValid } from "date-fns";
import { selectUserDetails, selectUserDetailsError, selectUserDetailsLoading } from "@/Redux/Slice/Auth/UserSlice.js";
import { updateUserDetails } from "@/Redux/AsyncThunk/Auth/UserDetailsAsyncThunk.js";

// Define Zod schema
const schema = z.object({
    address: z.string().nonempty("Address is required"),
    city: z.string().nonempty("City is required"),
    pinCode: z.string()
        .nonempty("Pin Code is required")
        .length(6, "Pin Code must be 6 digits"),
    nationality: z.string().nonempty("Nationality is required"),
    country: z.string().nonempty("Country is required"),
    dateOfBirth: z.string()
        .nonempty("Date of Birth is required")
        .length(10)
        .refine(date => {
            const parsedDate = parse(date, "dd-MM-yyyy", new Date());
            return isValid(parsedDate);
        }, "Invalid date format")
});

export const ProfileUpdateForm = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset, control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            address: '',
            city: '',
            pinCode: '',
            nationality: '',
            country: '',
            dateOfBirth: '',
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const isProfileUpdateLoading = useSelector(selectUserDetailsLoading);
    const profileUpdateError = useSelector(selectUserDetailsError);
    const userDetails = useSelector(selectUserDetails);

    useEffect(() => {
        if (userDetails) {
            reset({
                address: userDetails.address || '',
                city: userDetails.city || '',
                pinCode: userDetails.pinCode || '',
                nationality: userDetails.nationality || '',
                country: userDetails.country || '',
                dateOfBirth: userDetails.dateOfBirth ? format(new Date(userDetails.dateOfBirth), 'dd-MM-yyyy') : '',
            });
        }
    }, [userDetails, reset]);

    const onSubmit = async (data) => {
        if (!isProfileUpdateLoading && !isSubmitting) {
            setIsSubmitting(true);
            try {
                // Convert date from dd-MM-yyyy to yyyy-MM-dd format
                const formattedDate = format(parse(data.dateOfBirth, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
                const result = await dispatch(updateUserDetails({ ...data, dateOfBirth: formattedDate })).unwrap();
                if (!result) {
                    console.log('Oops, something went wrong..!');
                } else {
                    console.log('Profile updated successfully:', result);
                    onClose(); // Close the dialog
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                }
            } catch (error) {
                console.error('An error occurred during profile update:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Dialog>
            <div className='pt-10 space-y-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <h1 className='pb-1'>Address</h1>
                        <Input
                            {...register('address')}
                            className={`py-7 text-lg ${errors.address ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="123 Main St"
                        />
                        {errors.address && <p className='text-red-500'>{errors.address.message}</p>}
                    </div>
                    <div>
                        <h1 className='pb-1'>City</h1>
                        <Input
                            {...register('city')}
                            className={`py-7 text-lg ${errors.city ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="Bangalore"
                        />
                        {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
                    </div>
                    <div>
                        <h1 className='pb-1'>Pin Code</h1>
                        <Input
                            {...register('pinCode')}
                            className={`py-7 text-lg ${errors.pinCode ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="560087"
                        />
                        {errors.pinCode && <p className='text-red-500'>{errors.pinCode.message}</p>}
                    </div>
                    <div>
                        <h1 className='pb-1'>Nationality</h1>
                        <Input
                            {...register('nationality')}
                            className={`py-7 text-lg ${errors.nationality ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="Indian"
                        />
                        {errors.nationality && <p className='text-red-500'>{errors.nationality.message}</p>}
                    </div>
                    <div>
                        <h1 className='pb-1'>Country</h1>
                        <Input
                            {...register('country')}
                            className={`py-7 text-lg ${errors.country ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="India"
                        />
                        {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
                    </div>
                    <div>
                        <h1 className='pb-1'>Date of Birth</h1>
                        <Input
                            type='text'
                            {...register('dateOfBirth')}
                            className={`py-7 text-lg ${errors.dateOfBirth ? 'bg-red-600 ' : 'bg-transparent text-white'}`}
                            placeholder="dd-MM-yyyy"
                        />
                        {errors.dateOfBirth && <p className='text-red-500'>{errors.dateOfBirth.message}</p>}
                    </div>
                    {profileUpdateError && <p className='text-red-500'>{profileUpdateError}</p>}
                    <Button type='submit' className='w-full py-7 mt-4 text-xl' disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </div>
        </Dialog>
    );
};
