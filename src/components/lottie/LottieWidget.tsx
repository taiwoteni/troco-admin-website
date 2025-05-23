'use client'

import dynamic from 'next/dynamic';
import React from 'react'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface props{
    lottieAnimation:unknown,
    width?:number | string,
    height?:number | string,
    className?: string | undefined
    loop?:boolean,
  }



export default function LottieWidget({lottieAnimation, width, height, className='', loop=true}:props) {
  const widthClassName = typeof width == 'number'? `w-[${width}px]`:`w-[${width ?? 'fit'}]`
  const heightClassName = typeof height == 'number'? `h-[${height}px]`:`h-[${height ?? 'fit'}]`

    
  return (
    <Lottie className={` ${widthClassName} ${heightClassName} ${className} overflow-hidden`} animationData={lottieAnimation} color='#2196f3' loop={loop} width={width ?? 100} height={height ?? 100}  />
  )
}
