'use client';

import Image from "next/image";
import { referral } from "../../utils/interfaces/referral";
import React, { CSSProperties, Key } from 'react'

interface props{
    referral: referral,
    style?:CSSProperties,
    onClick?: ()=> void,
    key?:Key,

}

export default function ReferralItemLayout({referral, style, key}:props) {
  return (
    <div key={key} className='flex py-3 px-3 cursor-pointer w-full justify-center items-center hover:bg-[#F9F8F6] transition-[background-color] duration-[0.5s]' style={style}>
        <Image width={48} height={48} src={referral.userImage ?? '/images/profile_img.png'} alt="user-image" className={`w-[48px] h-[48px]  rounded-[50%] mr-[20px] ${!referral.userImage? 'scale-150':''}`} />
        <div className="flex flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
            <p className="text-sm font-semibold whitespace-nowrap text-ellipsis">{referral.firstName ?? "No"} {referral.lastName ?? "Name"}</p>
            <p className={`text-xs ${referral.status === "completed"? "text-themeColor": "text-red-500"}`}>
            {referral.status}
            </p>
        </div>    
    </div>
  )
}
