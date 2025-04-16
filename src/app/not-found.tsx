"use client"

import Lottie from 'lottie-react'
import React from 'react'
import errorAnim from '../../public/lottie/error.json'
import { usePathname, useRouter } from 'next/navigation'


export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter();
  
  return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
      <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
      <h2 className='text-[25px] font-bold font-lato'>Page Not Found</h2>
      <p className='text-secondary font-quicksand font-medium -mt-1 text-sm'>The page <span className='font-bold font-lato'>{pathname}</span> does not seem to exist in this website.<br /></p>
      <button className='min-w-[80px] w-fit px-2 py-3 text-center text-[12px] font-semibold mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>router.replace('/')}>Reload Website</button>
  
    </div>
}
