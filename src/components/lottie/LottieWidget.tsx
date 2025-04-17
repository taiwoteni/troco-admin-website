'use client'

import dynamic from 'next/dynamic';
import React from 'react'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface props{
    lottieAnimation:unknown,
    width?:number,
    height?:number,
    className?: string | undefined
    loop?:boolean,
  }



export default function LottieWidget({lottieAnimation, width, height, className='', loop=true}:props) {
    
  return (
    <Lottie className={className} animationData={lottieAnimation} color='#2196f3' loop={loop} width={width ?? 100} height={height ?? 100}  />
  )
}
