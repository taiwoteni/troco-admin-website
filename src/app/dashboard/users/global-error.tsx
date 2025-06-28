'use client';

import LottieWidget from '@/components/lottie/LottieWidget';
import errorAnim from '../../../../public/lottie/error.json';
import React, { useEffect } from 'react'

export default function Error({error,reset,}: {error: Error & { digest?: string }, reset: () => void}) {

    useEffect(()=>{
        console.log(error)
    },[error])
  return (
    <div className='w-full h-full flex flex-col gap-2 flex-center'>
        <LottieWidget lottieAnimation={errorAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
        <h2 className='text-[25px] font-bold font-lato'>An Unexpected Error Occurred</h2>
        <p className='text-secondary font-quicksand -mt-1 text-sm'>Please try again later.</p>
        <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>reset()}>Retry</button>
    </div>
  )
}
