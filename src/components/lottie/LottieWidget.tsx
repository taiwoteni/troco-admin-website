import React from 'react'
import Lottie from 'lottie-react'

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
