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
import { useState } from "react";

// Define validation schema
const formSchema = z.object({
    email: z.string()
        .nonempty("Email is required")
        .email("Email is not well-formed")
});

export const ForgotPassword = () => {
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Initialize react-hook-form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`/forgot-password/${data.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(result);
                setIsError(false);
            } else {
                const errorResult = await response.json();
                setMessage(errorResult.message || "An error occurred");
                setIsError(true);
            }
        } catch (error) {
            setMessage("An error occurred");
            setIsError(true);
        }

        form.reset();
    }


    return (
        <div className='p-4'>
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
                                    <Input className='w-full' placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full'>
                        Send Reset Link
                    </Button>
                </form>
            </Form>
            {message && (
                <div className={`mt-4 ${isError ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}
