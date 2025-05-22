import React from 'react'
import { Colors } from '@/utils/Colors'
import Image from 'next/image'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

interface props{
    label:string,
    value:string,
    icon: string | StaticImport,
    background?:string,
    top?:boolean,
    bottom?:boolean,
}


export default function DashboardCard({label, value,icon, background=Colors.themeColor, top=true, bottom=false}:props) {
  return (
    <div className='relative w-[280px] select-none h-[120px] rounded-[30px] overflow-hidden' style={{backgroundColor:background}}>
        <div className='absolute rounded-[50%] w-[120px] h-[120px] z-20 bg-white opacity-[0.2]' style={{top:top?'-30px':'auto', bottom:bottom?'-30px':'auto', right:'-30px'}}/>
        <div className='w-full h-full flex z-30 justify-start items-start pt-[11%] pl-[8%] gap-[8%] bg-transparent'>
            <div className='w-[60px] h-[60px] rounded-[50%] bg-white bg-opacity-40 inline-flex items-center justify-center'>
                <Image className='w-[40px] h-[40px] opacity-100' alt='dashboard image icon' src={icon} width={50} height={50}/>
            </div>
            <div className='flex flex-col h-fit text-left text-white gap-[1px]'>
                <h1 className='text-[3.7vh] font-semibold'>{value}</h1>
                <p className='text-[13px] font-sm font-quicksand'>{label}</p>
            </div>
        </div>
    </div>
  )
}
