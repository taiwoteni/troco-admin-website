'use client';

import React, { CSSProperties, useEffect, useState } from 'react'
import { walletTransaction } from '@/utils/interfaces/wallet-transaction';
import { Colors } from '@/utils/Colors';

import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { formatCurrency } from '@/utils/Format';

interface props{
    transaction:walletTransaction,
    style?:CSSProperties,
    showStatus?:boolean,
    onClick?: ()=> void
}



export default function WalletTransactionItem({transaction, style, onClick}:props) {
    const isIncome = transaction.walletType === "Income";
    const colour = isIncome? Colors.themeColor:'#dc2626';

    const [rotation, setRotation] = useState<string>(isIncome? 'rotate(180deg)':'rotate(0deg)');

    useEffect(()=>{
        setTimeout(()=> setRotation(isIncome? 'rotate(0deg)':'rotate(180deg)'), 2000)
    },[isIncome])

    function ellipsize(textString:string, maxLength:number){
        if(textString.trim().length <= maxLength){
          return textString;
        }
      
        return `${textString.trim().substring(0, maxLength)}...`
    }

  return (
    <div onClick={onClick} className='flex py-3 px-3 cursor-pointer w-full justify-center items-center hover:bg-[#F9F8F6] transition-[background-color] duration-[0.5s]' style={style}>
        <div style={{color:colour, transform: rotation, transition:'transform 1s ease'}} className={`w-[48px] h-[48px] text-[23px] rounded-[50%] mr-[20px] flex items-center justify-center ${isIncome? 'bg-[#109E15]' :'bg-[#dc2626]'} bg-opacity-10`}>
            <PiPaperPlaneTiltFill />
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{ellipsize(transaction.content, 35)}</p>
            <p className="text-xs text-gray-500">
            {transaction.status}
            </p>
        </div>
        <div className='flex flex-1'/>
        <p style={{color:isIncome? Colors.themeColor:'#dc2626'}} className='font-bold text-lg'>{formatCurrency(transaction.amount)}</p>
    </div>
  )
}
