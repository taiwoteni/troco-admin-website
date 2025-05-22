'use client'

import React, { CSSProperties } from 'react'
import { fullTransaction, transaction } from '../../utils/interfaces/transaction'
import Image from 'next/image'
import formatDate from '../../utils/DateFormat'
import { Colors } from '../../utils/Colors'

interface props{
    transaction:transaction | fullTransaction,
    style?:CSSProperties,
    showStatus?:boolean,
    onClick?: ()=> void
}

export function getStatusColor(status:string):string{
    switch(status.trim().toLowerCase()){
        case 'pending':
            return 'brown'
        case 'in progress':
            return '#ffc400';
        case 'processing':
            return '#ff33aa';
        case 'ongoing':
            return 'purple';
        case 'finalizing':
            return '#960096';   
        case 'completed':
            return Colors.themeColor;
        case 'approved':
            return Colors.themeColor;                  
        default:
            return 'red'
    }
}

export default function TransactionItemLayout({transaction, style, onClick}:props) {
  return (
    <div onClick={onClick} className='flex p-2 cursor-pointer w-full justify-center items-center' style={style}>
        <div className="w-[43px] h-[43px] rounded-[50%] mr-[20px] flex items-center justify-center" style={{backgroundColor:'#e8fce8'}}>
            <Image src='/icons/transaction/transaction.svg' alt="Icon" width={25} height={25}/>
        </div>
        <div className="flex flex-col">
            <p className="text-sm  font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{transaction.transactionName}</p>
            <p className="text-xs text-gray-500">
            {formatDate(transaction.DateOfWork)}
            </p>
        </div>
        <div className='flex flex-1'/>
        <div className='rounded-3xl inline-flex text-[11px] font-semibold px-[10px] py-[5px] text-white' style={{backgroundColor:getStatusColor(transaction.status)}}>{transaction.status}</div>
    </div>
  )
}
