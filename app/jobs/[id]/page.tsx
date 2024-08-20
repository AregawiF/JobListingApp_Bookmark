"use client";
import React from 'react';
import Image from 'next/image';
import AboutDetail from '@/app/components/AboutDetail';
import { useGetSingleOpportinityQuery } from '@/app/service/apiData';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const JobDetailPage = ({ params }: { params: { id: string } }) => {
    const {data: session} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/jobs');
        },
    });

    const styles = ['mr-4 p-2 my-3 rounded-full bg-bgGreen text-mygreen bg-opacity-10 font-Epilogue', 'mr-4 p-2 my-1 rounded-full bg-orangeBG text-myorange bg-opacity-10 font-Epilogue', 'mr-4 p-2 my-1 rounded-full bg-mypurple text-mypurple bg-opacity-10 font-Epilogue' ]

    const { id } = params;

    const {data, isError, isLoading} = useGetSingleOpportinityQuery(id);
    console.log(data);
    const job = data?.data
    
    if (isError){
        return <h1 className='text-center mt-36 text-lg'>Ooops there seems to be an error</h1>
    }
    if (isLoading){
        return <h1 className='text-center text-lg mt-96'>Loading ....</h1>
    }

    const resp = job.responsibilities.split("\n")
    return (
        <div className='grid grid-cols-10 gap-14 p-10'>
        <div className='col-span-7'>
            <div className='mb-14'>
            <h1 className='subHeading mb-3'>Description</h1>
            <p className='font-Epilogue leading-6'>{job.description}</p>
            </div>
            <div className='mb-14'>
                <h1 className='subHeading my-4'>Responsibilities</h1>
                
                <ul>
                    {resp.map((r:string) => 
                    <div className='flex gap-2 mb-2'>
                    <Image width={25} height={10} src='/bullets/bullet.png' alt='bullet'></Image>
                    <li>{r}</li>
                    </div>)}
                </ul>
            </div>
            <div className='mb-14'>
            <h1 className='subHeading'>Ideal Candidate we want</h1>
            <ul className='pl-6 leading-6 mt-3'>
                <li className='font-Epilogue list-disc'>{job.idealCandidate}</li>
            </ul>
            </div>
            <div>
            <h1 className='subHeading mb-6'>When & Where</h1>
            <div className='flex'>
                <div>
                <Image width={44} height={44} src='/icons/location.png' alt='location icon'></Image>
                </div>
                <div className='flex items-center'>
                <span className='ml-4 font-Epilogue'>{job.whenAndWhere}</span>
                </div>
            </div>

            </div>
        </div>
        <div className='col-span-3'>
            <h1 className='subHeading'>About</h1>
            <div className='border-b border-gray-300 pb-5'>
                {<AboutDetail title="Posted On" content={job.datePosted}/>}
                {<AboutDetail title="Deadline" content={job.deadline}/>}
                {<AboutDetail title="Location" content={job.location.map((loc:string) => <span>{loc}</span>)}/>}
                {<AboutDetail title="Start Date" content={job.startDate}/>}
                {<AboutDetail title="End Date" content={job.endDate}/>}
            </div>
            <div className='py-4 border-b border-gray-300'>
            <h1 className='subHeading mb-2'>Catagories</h1> 
            {job.categories.map((c:string, idx:number) => <button className={styles[idx%3]}>{c}</button>)}
            </div>
            <div className=''>
            <h1 className='subHeading my-5'>Required Skills</h1> 
            <div className='flex flex-wrap'>
            {job.requiredSkills.map((r:string) => <div className='m-1 px-3 py-1 bg-graybg text-mypurple font-Epilogue'>{r}</div>)}
            </div>
            </div>

        </div>
        </div>
  );
};

export default JobDetailPage