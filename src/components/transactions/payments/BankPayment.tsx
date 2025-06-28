'use client';

import { Colors } from "../../../utils/Colors";
import { accountDetail } from "../../../utils/interfaces/account-detail";
import bankAnim from "../../../../public/lottie/bank-payment.json"
import React, { CSSProperties } from 'react'
import LottieWidget from "@/components/lottie/LottieWidget";


interface prop{
    accountDetails:accountDetail
    style?:CSSProperties,
}


export default function BankPayment({accountDetails, style}:prop) {
  return (
    <div className="flex w-full" style={style}>
        <div style={{borderColor:Colors.themeColor}} className="flex w-full border-[3px] rounded-xl px-2 py-3 bg-[#109E150D] gap-4 justify-center items-center">
        <LottieWidget lottieAnimation={bankAnim} width={50} height={50} />
        <div className='flex flex-col flex-1 gap-0.5'>
            <p className="font-bold text-[15px]">{accountDetails.accountName}</p>
            <div className="flex justify-start items-center gap-3 text-[13px]">
                <p>{accountDetails.accountNumber}</p>
                <div className="bg-black rounded-[50%] p-0.5" />
                <p>{accountDetails.bankName}</p>
            </div>
        </div>
    </div>
    </div>
  )
}
