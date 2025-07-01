'use client';

import { useAdmin } from '@/providers/AdminProvider';
import { useRouter } from 'next/navigation';
import React, { ReactNode} from 'react'
import Routes from '../routes';
import errorAnim from '../../../public/lottie/error.json'
import Navbar from '@/components/navbar/NavBar';
import dynamic from 'next/dynamic';
import SideBar from '@/components/sidebar/Sidebar';
import { registerChartModules } from '@/lib/chartjs.config';
import { getPinEntered } from '@/utils/cache/session-pin-cache';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// To register Chart Features for all components and pages used within the dashboard
registerChartModules();


export default function DashboardLayout({children}:{children?: ReactNode}) {
    const {admin} = useAdmin();
    const router = useRouter();

    if(!admin){
        return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
            <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>Not Logged In</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>{"You're not logged in.\nPlease log into your admin account."}</p>
            <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>router.replace(Routes.auth.login.path)}>Login</button>

        </div>
    }

    if(admin.blocked){
      return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
            <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>You have been blocked !!</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>{"Your account has been disabled and temporarily been banned"}</p>
        </div>
    }

    if(!getPinEntered()){
      return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
            <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>Verification Needed</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>{"We need to verify you are an Admin Supervisor at Troco Technologies.\b"}</p>
            <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>router.replace(Routes.auth.twoFactorAuth.path)}>Verify</button>

        </div>
    }

  return (
    <div className='w-screen h-screen flex bg-tertiary'>

        {/* Drawer */}
        <SideBar />
        <div className='flex flex-1 h-screen flex-col overflow-hidden'>
            <Navbar />
            <div className='w-full flex flex-1 overflow-hidden'>
                <div className='w-full h-full'>
                  {children}
                </div>
            </div>
        </div>
        
    </div>
  )
}
