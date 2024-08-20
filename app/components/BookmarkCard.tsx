'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';


export interface BOOKMARK {
    bid: string,
    title: string,
    locationStr: string,
    opType: string,
    dateBookmarked: string,
    image: string,
    isBookmarked: boolean
}
const buttonStyles = ['ml-4 mt-5 px-3 border-2 rounded-full border-myorange text-myorange', 'ml-4 mt-5 px-6 border-2 rounded-full border-mypurple text-mypurple']

const BookmarkCard = ({bid, title, locationStr, opType, dateBookmarked, image}:BOOKMARK) => {



    const { data: session, status } = useSession();
    const [fillColor, setFillColor] = useState('#515B6F');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    const handleBookmarkToggle = async (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!session) {
        setError('You need to log in to bookmark jobs.');
        return;
      }

      const target = event.target as HTMLElement;
      if (!target.closest('svg')) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://akil-backend.onrender.com/bookmarks/${bid}`, {
          method: fillColor === '#ffffff' ? 'POST' : 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.message || 'Failed to create bookmark');
        }

        setFillColor(prevColor => (prevColor === '#ffffff' ? '#515B6F' : '#ffffff'));
            console.log(`${fillColor === '#ffffff' ? 'Bookmark created' : 'Bookmark removed'} successfully!`);
        } catch (error) {
            setError((error as Error).message);
            console.error(`Failed to ${fillColor === '#ffffff' ? 'create' : 'remove'} bookmark:`, error);
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    };




    const location : string[] = locationStr.split(',');
  return (
    <div data-testid={`card-${bid}`} className='flex justify-center my-7'>
        <div className='w-3/5 grid grid-cols-12 p-1 border-2 rounded-3xl border-gray-300 font-Epilogue hover:bg-cardHover shadow-lg' onClick={handleBookmarkToggle}>
            <div className='col-span-1 py-5'>
                <Image width={70} height={70} src={image} alt='pic'/>
            </div>
            <div className="col-span-11 mx-4" >
                <div className='my-3'>
                  <div className='flex justify-between'>
                      <h3 className='font-bold text-xl'>{title}</h3>
                      <svg data-testid="bookmark-icon" xmlns="http://www.w3.org/2000/svg" width="35" height="45" viewBox="0 0 24 24" fill={fillColor} stroke="#515B6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ cursor: 'pointer' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <div>
                    {location.map((l, index) => <span key={index} className='text-base text-gray-700 font-semibold'>{l}   {
                    index == location.length -1 ? "" : " | "} </span>)}
                  </div>
                </div>
                <div>
                  <p className='font-Epilogue text-lg font-light text-gray-700'>Bookmarked on: {formatDate(dateBookmarked)}</p>
                </div>
                <div className='border-r-2 my-5 '>
                    <button className='mr-4 px-3 py-1 rounded-full bg-bgGreen text-mygreen bg-opacity-10'>{opType}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BookmarkCard