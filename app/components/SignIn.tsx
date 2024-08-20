"use client";
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';


type SigninFormValues = {
    email: string
    password: string,
}

const SignIn = () => {
    const session = useSession();
    const form = useForm<SigninFormValues>();
    const { register, handleSubmit, formState} = form;
    const { errors } = formState;

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    if (session.data){
        redirect('/jobs');
    }

    const onSubmit = async (data: SigninFormValues) => {
    const result = await signIn("credentials", {
    //   redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.ok) {
    //   router.push("/jobs");
        redirect('/jobs');
    } else {
        result?.status == 401 ? setErrorMessage( "Incorrect password") : 
        console.log(result);
    }
  };

    return (
    <div className="flex justify-end">
        <form className='mt-24 mr-52 ' onSubmit={handleSubmit(onSubmit)}>
            <h1 className="font-Poppins font-black text-3xl mb-3 text-center">Welcome Back,</h1>
            <div className="inline-flex items-center justify-center w-full">
                <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div> 
            <div className="mb-6">
                <label htmlFor="email" className="text-darkgray font-semibold font-Epilogue">Email Adress</label>
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
                <label htmlFor="password" className="text-darkgray font-semibold font-Epilogue">Password</label>
                <input className={`border-2 py-3 px-4 rounded-md mt-1 w-full ${errors?.password ? 'border border-errorRed' : ''}`} placeholder="Enter password" type="password" id="password" {...register('password',{
                    minLength: {
                        value: 6,
                        message: 'Password must be atleast 6 characters long!'
                    },
                    required:'password is required!'
                })}/>
                <p className="text-errorRed font-Epilogue">{errors.password?.message}</p>
                <div>
                    <span className='text-errorRed font-Epilogue'>{errorMessage}</span>
                </div>
            </div>
            <button type="submit" className={`bg-darkerPrimaryPurple rounded-full py-3 w-full text-white font-Epilogue font-bold mb-6 hover:drop-shadow-xl ${loading ? 'opacity-30' : ''}`}>Login</button>
            <div className="mb-6">
                <span className="text-gray-600">Don’t have an account? </span>
                <Link href="/auth/signup" className="text-darkerPrimaryPurple font-semibold">Sign Up</Link>
            </div>
            
        </form>
        
    </div>
    )
}

export default SignIn