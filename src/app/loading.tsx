"use client"

import React from 'react'
import loadingAnim from '../../public/lottie/loading_water.json'
import LottieWidget from '@/components/lottie/LottieWidget'

export default function Loading() {
  return (
    <div className='w-full h-full flex flex-col flex-center'>
        <LottieWidget lottieAnimation={loadingAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
        <h2 className='text-[25px] font-bold font-lato'>Loading this page</h2>
        <p className='text-secondary font-quicksand -mt-1 text-sm'>This should <b>not</b> take a while.</p>
            
    </div>
  )
}
