import React from 'react'
import Image from 'next/image'

interface props{
  title: string, 
  content:string
}

const AboutDetail = ({title, content}:props) => {
  return (
    <div className='flex mt-4 '>
        <Image width={44} height={44} src={`/icons/${title}.png`} alt={title+" icon"}></Image>
        <div className='pl-4'>
            <span className='font-Epilogue text-darkgray block'>{title}</span>
            <span className='font-Epilogue font-semibold'>{content}</span>
        </div>
    </div>
  );
}

export default AboutDetail