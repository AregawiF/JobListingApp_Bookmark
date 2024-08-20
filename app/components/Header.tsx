"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image'

const Header = () => {
  const {data: session} = useSession();
  return (
    <div className='flex justify-end mr-40 mt-2'>
        {session ? 
        <div className='flex align-bottom'>
            
            <div className="dropdown">
            <Image src={'/icons/default-profile.png'} width={40} height={10} alt="profile image" role="button" tabIndex={0} className=' m-1 rounded-full w-12 my-auto' />
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li className='mb-2 font-semibold'><Link href={'/jobs'}>Opportunities</Link></li>
              <li className='mb-2 font-semibold'><Link href={'/bookmarks'}>Bookmarks</Link></li>
              <li><Link href="/api/auth/signout?callbackUrl=/" className='btn-outline btn-error font-semibold'>Log Out</Link></li>
            </ul>
        </div>
            
        </div>
        : <div></div>}
    </div>
  )
}

export default Header