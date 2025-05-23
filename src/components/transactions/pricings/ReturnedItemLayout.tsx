'use client'

import { Colors } from "../../../utils/Colors";
import React, { CSSProperties } from 'react'
import { SalesItem } from "../../../utils/interfaces/sales-item";
import Image from "next/image";
import { formatCurrency } from '../../../utils/Format';


interface prop{
    item:SalesItem,
    style?:CSSProperties,
}


export default function ReturnItemLayout({item, style}:prop) {
  return (
    <div className="flex w-full" style={style}>
        <div style={{borderColor:Colors.tertiary}} className="flex w-full border-[3px] rounded-xl px-2 py-3 bg-transparent gap-4 justify-center items-center">
        <Image src={item.mainImage!} alt='product image' width={60} height={60} />
        <div className='flex flex-col flex-1 gap-0.5'>
            <p className="font-bold text-[15px]">{item.name}</p>
            <div className="flex justify-start items-center gap-3 text-[13px]">
                <p className="font-bold" style={{color:Colors.themeColor}}>{formatCurrency(item.totalPrice)}</p>
            </div>
        </div>
    </div>
    </div>
  )
}
