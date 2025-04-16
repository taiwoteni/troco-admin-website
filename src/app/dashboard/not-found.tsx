"use client";


import Lottie from 'lottie-react'
import React from 'react'
import errorAnim from '../../../public/lottie/error.json'


export default function NotFound() {
  return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
              <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
              <h2 className='text-[25px] font-bold font-lato'>Oops! Not Found</h2>
              <p className='text-secondary font-quicksand -mt-1 text-sm'>This page does not seem to exist.<br /></p>
              <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor'>Login</button>
  
          </div>
}
