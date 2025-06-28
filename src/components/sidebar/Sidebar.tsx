"use client";

import Routes from '@/app/routes';
import { useSideBarMenu } from '@/utils/data/SideBarData';
import { HambergerMenu } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SideBar() {
     const [expand, expandDrawer] = useState<boolean>(true);
    // const {admin} = useAdmin();
    const router = useRouter();
    const pathName = usePathname();

    const menus = useSideBarMenu();

  return (
    <div className={`flex h-screen overflow-hidden flex-col bg-white shadow-sm ${expand? 'w-[285px]': 'w-[103px]'} ease duration-500 transition-all allow-discrete`}>
                <div className='flex p-5 border-b h-[80px] items-center gap-3 w-full overflow-hidden'>
                    <HambergerMenu onClick={()=>expandDrawer(!expand)} color={'#000'} className={`w-[32px] h-[32px] cursor-pointer font-bold ${expand? 'rotate-0' : 'rotate-180'} duration-500 transition-all ease`} />
                    <Image onClick={()=>router.replace(Routes.dashboard.path)} src={'/images/dashboard/troco.png'} className={`${expand? 'block' :'hidden w-0'} ease transition-all duration-500`} objectFit='contain'  alt='troco' width={130} height={32} />
                </div>
                <div className='w-full flex-1 overflow-hidden overflow-y-scroll custom-scrollbar'>
                  <div className='w-full h-fit flex flex-col gap-2'>
                    {menus.map((item, index) => (
              <div key={index} style={{marginTop:index===0?'40px':'0'}} className='flex px-5 overflow-hidden items-center'>
              {/* {(SideBarArray.indexOf(item) === 0? pathName === item.path:pathName.startsWith(item.path)) && (
                <div className="w-[5px] h-[50px] rounded-r-lg bg-themeColor" />
              )} */}
              <Link  href={item.path}
              onClick={!item.negative? undefined: (e)=>{
                e.preventDefault();
                e.stopPropagation();

                if(item.onClick){
                  item.onClick();
                }
              }}
                className={`${(index === 0? pathName === item.path:pathName.startsWith(item.path))
                  ? "text-white bg-themeColor"
                  : "text-secondary"
                  } ${item.negative? 'text-red-500 bg-white':''} justify-start rounded-xl p-5 h-[60px] w-full px-5 font-semibold text-sm flex items-center gap-x-5 relative`}>
    
    
                <div className={`w-[20px] ${(index === 0? pathName === item.path:pathName.startsWith(item.path))? 'text-white':'text-themeColor'}  ${item.negative? 'text-red-500':''}`}>
                  {item.icon}
                </div>
    
                <span className={`flex-1 text-start  ${item.negative? 'text-red-500':''} ${expand?'':'text-transparent'} whitespace-nowrap text-ellipsis  text-[16px] font-semibold`}>
                  {item.title}
                </span>
              </Link>
              </div>
            ))}
                  </div>

                </div>
            </div>
  )
}
