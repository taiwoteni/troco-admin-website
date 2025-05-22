'use client'

import Image from "next/image";
import React, { CSSProperties } from "react";
import { Group } from "./GroupItemLayout";

function senderText(group: Group, userId:string): string {
  if(group.creator === userId){
    return "Creator of group"
  }

  return "Buyer of group";
}



interface props {
  group: Group;
  userId:string;
  style?:CSSProperties
  onClick?:()=> void
}

export default function CompactGroupItemLayout({ group, userId, style, onClick}: props) {
  return (
    <div onClick={onClick} className='flex p-2 cursor-pointer w-full justify-center items-center' style={style}>
        <div className="w-[43px] h-[43px] rounded-[50%] mr-[20px] flex items-center justify-center" style={{backgroundColor:'#e8fce8'}}>
            <Image src='/icons/dashboard/group.svg' alt="Icon" width={25} height={25}/>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-semibold w-full whitespace-nowrap text-ellipsis">{group.name}</p>
            <p className="text-xs text-gray-500">
            {senderText(group, userId)}
            </p>
        </div>
        <div className='flex flex-1'/>
        {/* <div className='rounded-3xl inline-flex text-[11px] font-semibold px-[10px] py-[5px]' style={{color:transaction.status.toLowerCase() === 'pending'?'gray':'white',backgroundColor:getStatusColor(transaction.status)}}>{transaction.status}</div> */}
    </div>
  );
}
