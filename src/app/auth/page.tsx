'use client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Routes from '../routes';

export default function AuthPage() {
    const router = useRouter();
    useEffect(()=>{
        const t = setTimeout(()=>{
            router.replace(Routes.auth.login.path)
        }, 1)

        return ()=>clearTimeout(t);
    }, [router])
  return (
    <div>AuthPage</div>
  )
}
