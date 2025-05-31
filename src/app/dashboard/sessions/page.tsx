'use client'

import LoadingLayout from '@/components/loading/LoadingLayout'
import React from 'react'
import openOrderAnim from '../../../../public/lottie/open-group.json'

export default function page() {
  return (
    <div className='bg-white w-full h-full rounded-2xl shadow-md box-border overflow-hidden'>
        <LoadingLayout label="Open a session to message your users" className='h-full' lottie={openOrderAnim} />
    </div>
  )
}
