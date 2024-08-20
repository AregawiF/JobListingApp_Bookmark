"use client";
import { useForm } from "react-hook-form";
import Link from 'next/link';
import Image from 'next/image';
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";


type FormValues = {
    fullname: string
    email: string
    password: string,
    confirmPassword: string,
}

export default function SignUp(){
    const session = useSession();
    const form = useForm<FormValues>();
    const { register, handleSubmit, formState} = form;
    const { errors } = formState;

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const password = form.watch('password');

    const router = useRouter();
    if (session.data){
        redirect('/jobs');
    }
    
    async function onSubmit(data: FormValues) {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('https://akil-backend.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.fullname,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                    role: "user",
                }),
            });

            const responseData = await response.json();

            if (response.ok && responseData.success) {
                router.push(`/auth/otp-verification?email=${encodeURIComponent(data.email)}`);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Signup failed');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    }



    return (
    <div className="flex justify-center">
        <div className="w-2/5">
            <h1 className="font-Poppins font-black text-3xl mb-6 text-center">Sign Up Today!</h1>
            <div className="flex justify-center ">
                <button className="flex justify-center border-2 py-3 px-4 rounded-md w-full hover:drop-shadow-xl" onClick={()=> {signIn("google", {callbackUrl:"/jobs"})}}>
                    <Image width={25} height={20} src='/icons/Google_logo.png' alt='Google logo' />
                    <span className="text-primaryPurple ml-3 font-bold">Sign Up with Google</span>
                </button>
            </div>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-formGray -translate-x-1/2 bg-white left-1/2 font-Epilogue">Or Sign Up with Email</span>
                </div>  
            <form className="" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-6">
                    <label htmlFor="name" className="text-darkgray font-semibold font-Epilogue" >Full Name</label>
                    <input className={`border-2 py-3 px-4 rounded-md mt-1 w-full font-Epilogue ${errors?.fullname ? 'border border-errorRed' : ''}`} placeholder = "Enter your full name " type="text" id="name" {...register('fullname', {
                        required : 'Full name is required!'
                    })}/>
                    <p className="text-errorRed">{errors.fullname?.message}</p>
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className={`text-darkgray font-semibold font-Epilogue `}>Email Adress</label>
                    <input className={`border-2 py-3 px-4 rounded-md mt-1 w-full ${errors?.email ? 'border border-errorRed' : ''}`} placeholder="Enter email address" type="text" id="email" {...register('email',{
                        pattern: {
                            value: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                            message: 'Invalid email format!'
                        },
                        required:'Email is required!'
                    })}/>
                    <p className="text-errorRed font-Epilogue">{errors.email?.message}</p>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className={`text-darkgray font-semibold font-Epilogue`}>Password</label>
                    <input className={`border-2 py-3 px-4 rounded-md mt-1 w-full ${errors?.password ? 'border border-errorRed' : ''}`} placeholder="Enter password" type="password" id="password" {...register('password',{
                        minLength: {
                            value: 6,
                            message: 'Password must be atleast 6 characters long!'
                        },
                        required:'password is required!'
                    })}/>
                    <p className="text-errorRed font-Epilogue">{errors.password?.message}</p>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className={`text-darkgray font-semibold font-Epilogue`}>Confirm Password</label>
                    <input className={`border-2 py-3 px-4 rounded-md mt-1 w-full ${errors?.confirmPassword ? 'border border-errorRed' : ''}`} placeholder="Confirm password" type="password" id="confirmPassword" {...register('confirmPassword',{
                        validate: value =>
                            value === password || 'Passwords do not match!',
                        required:'confirm password!'
                    })}/>

                    <p className="text-errorRed font-Epilogue">{errors.confirmPassword?.message}</p>
                </div>
                
                <button type="submit" className={`bg-darkerPrimaryPurple rounded-full py-3 w-full text-white font-Epilogue font-bold mb-6 hover:drop-shadow-xl ${loading ? 'opacity-30' : ''}`}>{loading ? 'Signing up...' : 'Continue'}</button>
                {errorMessage && <p className="text-errorRed font-Epilogue">{errorMessage}</p>}
                <div className="mb-6">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link href="/auth/login" className="text-darkerPrimaryPurple font-semibold">Login</Link>
                </div>
                <div>
                    <p className="font-Epilogue text-sm text-darkgray font-medium">By clicking 'Continue', you acknowledge that you have read and accepted our <a href="#" className="text-primaryPurple"> Terms of Service</a> and <a href="#" className="text-primaryPurple">Privacy Policy</a>.</p>
                </div>

            </form>
        </div>
        </div>

    );
}