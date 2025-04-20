"use client"

import React, { useMemo } from 'react'
import loadingAnim from '../../../public/lottie/loading_water.json'
import LottieWidget from '@/components/lottie/LottieWidget'
import { usePathname } from 'next/navigation'

export default function Loading() {
  const pathname = usePathname();
  const pageName = useMemo<string>(()=>{
    const lastSlash = pathname.lastIndexOf('/')
    if(lastSlash !== pathname.length-1){
      return pathname.substring(lastSlash+1);
    }
    const pathNameWithoutLastSlash = pathname.substring(0,lastSlash);
    return pathNameWithoutLastSlash.substring(pathNameWithoutLastSlash.lastIndexOf('/')+1)

  },[pathname])
  return (
    <div className='w-full h-full flex flex-col gap-2 flex-center'>
        <LottieWidget lottieAnimation={loadingAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
        <h2 className='text-[25px] font-bold font-lato'>Loading {pageName.charAt(0).toUpperCase()}{pageName.substring(1).toLocaleLowerCase()}</h2>
        <p className='text-secondary font-quicksand -mt-1 text-sm'>Give us <b>a</b> minute.</p>
            
    </div>
  )
}
