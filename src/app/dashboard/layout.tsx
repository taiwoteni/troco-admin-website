'use client';

import { useAdmin } from '@/providers/AdminProvider';
import { usePathname, useRouter } from 'next/navigation';
import {HambergerMenu} from 'iconsax-react'
import Lottie from 'lottie-react'
import React, { ReactNode, useState } from 'react'
import Routes from '../routes';
import errorAnim from '../../../public/lottie/error.json'
import Image from 'next/image';
import Navbar from '@/components/navbar/NavBar';
import { SideBarArray } from '@/utils/data/SideBarData';
import Link from 'next/link';

export default function DashboardLayout({children}:{children?: ReactNode}) {
    const [expand, expandDrawer] = useState<boolean>(true);
    const {admin} = useAdmin();
    const router = useRouter();
    const pathName = usePathname();

    if(!admin){
        return <div className='w-full h-full flex flex-col items-center justify-center text-center gap-2'>
            <Lottie animationData={errorAnim} className='w-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>Not Logged In</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>{"You're not logged in.\nPlease log into your admin account."}</p>
            <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>router.replace(Routes.auth.login.path)}>Login</button>

        </div>
    }
  return (
    <div className='w-screen h-screen flex bg-tertiary'>

        {/* Drawer */}
        <div className={`flex h-screen overflow-x-hidden flex-col bg-white shadow-sm gap-5 ${expand? 'w-[290px]': 'w-[72px]'} ease duration-500 transition-all`}>
            <div className='flex p-5 border-b h-[80px] items-center gap-3 w-full overflow-x-hidden'>
                <HambergerMenu onClick={()=>expandDrawer(!expand)} color={'#000'} className={`w-[32px] h-[32px] cursor-pointer font-bold ${expand? 'rotate-0' : 'rotate-180'} duration-500 transition-all ease`} />
                <Image onClick={()=>router.replace(Routes.dashboard.path)} src={'/images/dashboard/troco.png'} className={`${expand? 'block' :'hidden w-0'} ease transition-all duration-500`} objectFit='contain'  alt='troco' width={130} height={32} />
            </div>
            {SideBarArray.map((item, index) => (
          <div key={item.path} style={{marginTop:index===0?'40px':'0'}} className='flex gap-3 items-center'>
          {(SideBarArray.indexOf(item) === 0? pathName === item.path:pathName.startsWith(item.path)) && (
            <div className="w-[5px] h-[50px] rounded-r-lg bg-themeColor" />
          )}
          <Link  href={item.path}
            className={`${(index === 0? pathName === item.path:pathName.startsWith(item.path))
              ? "rounded-xl w-[200px] h-fit text-white bg-themeColor"
              : "text-[#202224]"
              } justify-around p-5 h-[50px] w-full ml-5 px-3 font-semibold text-sm flex items-center gap-x-8 relative`}>


            <div className={`w-[20px] ${(index === 0? pathName === item.path:pathName.startsWith(item.path))? 'text-white':'text-themeColor'}`}>
              {item.icon}
            </div>

            <span className={`${(index === 0? pathName === item.path:pathName.startsWith(item.path))
              ? "text-white" : "text-[#495065]"} flex-1 text-start  text-[16px] font-semibold`}>
              {item.title}
            </span>
          </Link>
          </div>
        ))}
        </div>
        <div className='flex flex-1 h-screen flex-col overflow-hidden'>
            <Navbar />
            <div className='w-full flex flex-1'>
                {children}
            </div>
        </div>
        
    </div>
  )
}
