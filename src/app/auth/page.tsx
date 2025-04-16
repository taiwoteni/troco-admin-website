'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Routes from '../routes';

// This page just automatically redirects to the register page
export default function AuthPage() {
    const router = useRouter();
    useEffect(()=>{
        const t = setTimeout(()=>{
            router.replace(Routes.auth.login.path)
        }, 1)

        return ()=>clearTimeout(t);
    }, [router])
  return (
    <div className='w-full h-full bg-themeColor'>AuthPage</div>
  )
}
