'use client'

import { Colors } from "../../../utils/Colors";
import React, { CSSProperties } from 'react'
import { SalesItem } from "@/utils/interfaces/sales-item";
import documentAnim from "../../../../public/lottie/document.json";
import LottieWidget from "@/components/lottie/LottieWidget";


interface prop{
    item:SalesItem,
    url:string,
    style?:CSSProperties,
}


export default function PaymentReceipt({item, style}:prop) {
  return (
    <div className="flex w-full justify-start cursor-pointer" style={style}>
        <div style={{borderColor:Colors.themeColor}} className="flex w-full border-[2px] rounded-xl px-1.5 py-2.5 bg-transparent gap-4 justify-start items-center">
        <LottieWidget lottieAnimation={documentAnim} width={60} height={60} />
        <div className='flex flex-col text-start items-start flex-1 gap-[1px]'>
            <p className="font-bold text-[16px]">Payment Receipt</p>
            <p className="text-[12px] text-gray-600 w-full overflow-hidden whitespace-nowrap text-ellipsis">{`Open Payment receipt for ${item.name}`}</p>

        </div>
    </div>
    </div>
  )
}
