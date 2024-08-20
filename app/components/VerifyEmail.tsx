import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [countdown, setCountdown] = useState(15); 
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


        useEffect(() => {
        if (otp.every((digit) => digit !== '')) {
        setIsButtonDisabled(false);
        } else {
        setIsButtonDisabled(true);
        }
    }, [otp]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = event.target.value;
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (index < otp.length - 1) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) {
                    (nextInput as HTMLInputElement).focus();
                }
            }
        } else if (value === '') {
            if (index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) {
                    (prevInput as HTMLInputElement).focus();
                }
            }
        }
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const otpString = otp.join('');

        if (!email) {
            setErrorMessage('Email is missing.');
            setLoading(false);
            return;
        }

        fetch('https://akil-backend.onrender.com/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                OTP: otpString,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                router.push('/jobs');
            } else {
                setErrorMessage(data.message || 'Verification failed.');
            }
        })
        .catch(() => {
            setErrorMessage('An error occurred. Please try again later.');
        })
        .finally(() => {
            setLoading(false);
            setCountdown(15);
            setIsButtonDisabled(true);
        });
    }

    useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

    
  return (
    <div className="flex justify-center">

    <div className="w-2/6 mt-20">
        <div className=''>
            <h1 className="font-Poppins font-black text-3xl text-center mb-11">Verify Email</h1>
            <p className='text-mygray font-Epilogue mb-11'>We've sent a verification code to the email address you provided. To complete the verification process, please enter the code here.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className='flex justify-around mb-6'>
              {otp.map((digit, index) => (
                  <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      className='text-5xl border-2 rounded-xl py-2 px-4 w-20 text-center text-darkgray'
                  />
              ))}
            </div>
            <p className='text-mygray font-Epilogue text-center mb-20'>You can request to Resend code in {countdown} seconds. </p>
            <button type="submit" className={`bg-darkerPrimaryPurple rounded-full py-3 w-full text-white font-Epilogue font-bold mb-6 ${loading || isButtonDisabled ? 'opacity-30' : ''}`} disabled={isButtonDisabled || loading}>{loading ? 'Verifying...' : 'Continue'}</button>
            {errorMessage && <p className="text-errorRed font-Epilogue text-center">{errorMessage}</p>}

        </form>
    </div>
    </div>
  )
}

export default VerifyEmail