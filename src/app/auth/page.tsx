'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import loadingAnim from '../../../public/lottie/loading_water.json'
import Routes from '../routes';
import LoadingLayout from '@/components/loading/LoadingLayout';

// This page just automatically redirects to the login page
export default function AuthPage() {
    const router = useRouter();
    useEffect(()=>{
        const t = setTimeout(()=>{
            router.replace(Routes.auth.login.path)
        }, 100)

        return ()=>clearTimeout(t);
    }, [router])
  return (
    <div className='w-full h-full overflow-hidden'>
      <LoadingLayout label='Redirecting You' lottie={loadingAnim} className='w-full h-full' />
    </div>
  )
}
