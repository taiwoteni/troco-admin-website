'use client';
import { QueryErrorBoundary } from '@/components/error/QueryErrorBoundary';
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react'

export default function Layout({children}:{children?: ReactNode}) {
    const router = useRouter()
  return (
    <div onClick={router.back} className='fixed select-none inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
        <QueryErrorBoundary message={<span>Could not load this withdrawal.<br/>Either the withdrawal or Issuer (user) does not exist.<br/>Please try again later</span>}>{children}</QueryErrorBoundary>
    </div>
  )
}
