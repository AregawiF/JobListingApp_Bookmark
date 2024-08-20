"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import BookmarkCard from '../components/BookmarkCard';

const BookmarkList = () => {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchBookmarks = async () => {
        try {
          const response = await fetch('https://akil-backend.onrender.com/bookmarks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          });

          const responseData = await response.json();
          
          if (response.ok) {
            setBookmarks(responseData.data || []);
            console.log('response ok')
          } else {
            setError(responseData.message || 'Failed to fetch bookmarks');
          }
        } catch (error) {
          setError('An error occurred while fetching bookmarks');
        } finally {
          setLoading(false);
        }
      };

      fetchBookmarks();
    }
  }, [session, status]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please log in to view bookmarks.</div>;

  if (loading) return <h1 className="text-center text-lg mt-96">Loading Bookmarks...</h1>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;


  return (
    <div>
        <h1 className='font-Poppins text-4xl ml-56 font-black text-gray-700 mb-10'>Bookmarks</h1>
        {bookmarks.length == 0 ? <p className='font-Epilogue text-lg ml-10'>There are no bookmarks yet!</p> : 
        bookmarks?.map((bm:any) => 
            <div key={bm.eventID}>
                <BookmarkCard bid={bm.eventID}  title={bm.title} locationStr={bm.location} opType={bm.opType} dateBookmarked={bm.dateBookmarked} image={bm.logoUrl} isBookmarked={true}/>
            </div>
        )
        }
    </div>
  );
}

export default BookmarkList