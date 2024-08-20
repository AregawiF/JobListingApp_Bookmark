'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export interface Job {
    image: string,
    title: string,
    location: string[],
    description: string,
    opType: string,
    categories: string[],
    id: string,
    isBookmarked: boolean,
}
const buttonStyles = ['ml-4 mt-5 px-3 border-2 rounded-full border-myorange text-myorange', 'ml-4 mt-5 px-6 border-2 rounded-full border-mypurple text-mypurple']


const JobCard = ({image, title, location, description, opType,  categories, id, isBookmarked}:Job) => {
    const { data: session, status } = useSession();
    const [fillColor, setFillColor] = useState(isBookmarked ? '#515B6F' :'#ffffff');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    const handleBookmarkToggle = async (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!session) {
        setError('You need to log in to view jobs.');
        return;
      }

      const target = event.target as HTMLElement;
      if (!target.closest('svg')) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://akil-backend.onrender.com/bookmarks/${id}`, {
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
        } finally {
            setLoading(false);
        }
    };
    if (error !== ''){
      return <div>{error}</div>
    }


  return (
    <Link href={`/jobs/${id}`} key={id} passHref> 
      <div data-testid={`card-${id}`} className='grid grid-cols-12 p-6 my-11 border-2 rounded-3xl border-gray-300 font-Epilogue hover:bg-cardHover'>
          <div className='col-span-1'>
            <Image width={70} height={70} src={image} alt='pic'/>
          </div>
          <div className="col-span-11 mx-4" >
              <div>
                <div className='flex justify-between'>
                  <h3 className='font-bold text-xl mb-2'>{title}</h3>
                  {session && (
                  // <svg data-testid="bookmark-icon" xmlns="http://www.w3.org/2000/svg" width="35" height="45" viewBox="0 0 24 24" fill={fillColor} stroke="#515B6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  <div
                                    // @ts-ignore
                                    onClick={handleBookmarkToggle}
                                    className='cursor-pointer'
                                >
                                    <svg
                                        data-testid="bookmark-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="45"
                                        viewBox="0 0 24 24"
                                        fill={fillColor}
                                        stroke="#515B6F"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                  )}
                </div>
                <div data-testid="job-location">
                  {location.map((l, index) => <span key={index} className='text-base text-mygray'>{l}{
                    index == location.length -1 ? "" : " | "} </span>)}
                </div>
                <p className='text-gray-700 mt-3 text-base '> {description} </p>
              </div>
              <div className='flex'>
                <div className='border-r-2 mt-5 '>
                  <button className='mr-4 px-3 py-1 rounded-full bg-bgGreen text-mygreen bg-opacity-10'>{opType}</button>
                </div>
                {categories.map((cat, index) => <button key={index} className={buttonStyles[index]}>{cat}</button>)}
              </div>
          </div>
      </div>
    </Link>
  )
}

export default JobCard 