// "use client";

// import React, { useEffect, useState } from 'react';
// import JobCard from './JobCard';
// import { useGetAllOpportunitiesQuery } from '../service/apiData';
// import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';

// const JobList = () => {
//   const { data: session, status } = useSession();
//   const { data: jobsData, isError, isLoading } = useGetAllOpportunitiesQuery(undefined);
//   const [bookmarks, setBookmarks] = useState<string[]>([]);
//   const jobs = jobsData?.data;

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       if (session?.user?.accessToken) {
//         try {
//           const response = await fetch('https://akil-backend.onrender.com/bookmarks', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${session.user.accessToken}`,
//             },
//           });
//           const responseData = await response.json();
//           if (response.ok) {
//             setBookmarks(responseData.data.map((bookmark: { eventID: string }) => bookmark.eventID));
//           } else {
//             console.error(responseData.message || 'Failed to fetch bookmarks.');
//           }
//         } catch (error) {
//           console.error('An error occurred while fetching bookmarks:', error);
//         }
//       }
//     };

//     if (status === 'authenticated') {
//       fetchBookmarks();
//     }
//   }, [session, status]);

//   if (status === 'loading') return <h1 className='text-center text-lg mt-96'>Loading ....</h1>;
//   if (status === 'unauthenticated'){ 
//     redirect('/auth/signin');
//   }
//   if (isError) return <h1>Ooops, there seems to be an error</h1>;
//   if (isLoading) return <h1 className='text-center text-lg mt-96'>Loading ....</h1>;

'use client';

import React, { useState } from 'react';
import JobCard from './JobCard';
import { useGetAllBookmarksQuery, useGetAllOpportunitiesQuery,  } from '../service/apiData';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const JobList = () => {
  const { data: session, status } = useSession();
  const { data: jobsData, isError: jobsError, isLoading: jobsLoading } = useGetAllOpportunitiesQuery(undefined);
  const { data: bookmarksData, isError: bookmarksError, isLoading: bookmarksLoading } = useGetAllBookmarksQuery(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const jobs = jobsData?.data;
  const bookmarks = bookmarksData?.data.map((bookmark: { eventID: string }) => bookmark.eventID) || [];

  if (status === 'loading') return <h1 className='text-center text-lg mt-96'>Loading ....</h1>;
  if (status === 'unauthenticated') { 
    redirect('/auth/signin');
  }
  if (jobsError || bookmarksError) return <h1>Ooops, there seems to be an error</h1>;
  if (jobsLoading || bookmarksLoading) return <h1 className='text-center text-lg mt-96'>Loading ....</h1>;

     const filteredJobs = jobs?.filter((job: any) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const sortedJobs = filteredJobs?.sort((a: any, b: any) => {
    if (sortOption === 'Most Recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); 
    } else if (sortOption === 'Title') {
      return a.title.localeCompare(b.title); 
    } else {
      return 0; 
    }
  });

    return (
    <div className='pl-28 pr-52 '>
        <div className="header flex justify-between">
            <div className='flex'>
                <div>
                    <h1 className='text-3xl font-black font-Poppins'>Opportunities</h1>
                    <span className='text-sm text-mygray'>Showing {filteredJobs?.length} results</span>
                </div>
            </div>
            <div className='text-sm flex pr-7'>
                <div className='mr-10'>
                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow text-lg" placeholder="Search" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-6 w-6 opacity-60">
                            <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
                <span className='mr-3 text-mygray my-auto'>Sort by:</span>
                <div className="dropdown dropdown-right">
                    <div tabIndex={0} role="button" className="btn m-1">Choose an option</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a onClick={() => setSortOption('Most Recent')}>Most Recent</a></li>
                        <li><a onClick={() => setSortOption('Title')}>Title</a></li>
                    </ul>
                </div>
                <div>
                    <button></button>
                </div>
            </div>
        </div>
        <div>
            {sortedJobs?.map((job:any) => 
                <JobCard image={job.logoUrl} title={job.title} location={job.location} description={job.description} opType={job.opType} categories={job.categories} id={job.id} isBookmarked={bookmarks.includes(job.id)}  />
                )}
        </div>
    </div>
  )
}

export default JobList