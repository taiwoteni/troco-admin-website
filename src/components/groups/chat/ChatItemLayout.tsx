'use client'

import React, { useState } from 'react'
import { Colors } from '../../../utils/Colors';
import Image from 'next/image';
import { Group } from '@/utils/interfaces/group';
import { Message } from '@/utils/interfaces/message';
interface props{
    message:Message,
    group:Group,
    firstSender?:boolean,
    lastSender?:boolean,
    sameSender?:boolean,
    lastMessageSent?:boolean


}

const formatTime = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function senderText(group: Group, message:Message): string {
    if (message.sender === group.members[0]) {
      return "Seller ";
    }
  
    return "Buyer ";
  }

export default function ChatItemLayout({message, group, firstSender=true, sameSender = false, lastSender=false, lastMessageSent=false}:props) {
    /// if the person is the admin of the group, or a super admin
    const isSender = message.sender === group.adminId || !group.members.includes(message.sender ?? '');
    const alignViewsBottom = !message.attachment;
    const profileIconSize = 30;

    const [showTime, setShowTime] = useState<boolean>(false);

    function chatElement():React.JSX.Element{
        return <div className='max-w-[40%] w-fit'>
            {message.attachment && <div className='overflow-hidden max-h-[250px] rounded-[25px] relative w-full'>
                <Image src={message.thumbnail ?? message.attachment} layout='responsive' width={100} height={100} style={{ width: '100%', height: 'auto', maxHeight:'250px', objectFit:'cover' }} alt={''} /></div>}
            {message.content && <div className='rounded-[20px] w-fit py-2 px-4 flex flex-col items-center justify-center' style={{
            backgroundColor:isSender?Colors.themeColor:Colors.tertiary,
            color:isSender?'white':'black',
            fontSize:'15px',
            marginTop:message.attachment? '3px':0,
            cursor:'pointer'
        }}
        onClick={()=>setShowTime(!showTime)}>
            {firstSender && !isSender && <p className='text-[11px] font-extrabold self-start'>{senderText(group, message)}</p>}
            <p className='font-quicksand'>{message.content ?? ""}</p>
        </div>}
        </div>
    }


    return (
    <div className='w-full flex' style={{
        paddingTop:sameSender ? '3px':firstSender?'25px':'3px',
        paddingLeft:(lastSender? true:lastMessageSent) && !isSender?0:profileIconSize + 20,
        right:'16px',
        justifyContent:isSender?'flex-end':'flex-start'
    }}>
        <div className='w-full flex' style={{
            justifyContent:isSender?'end':'start',
            // that is if there is an attachment (image/video)
            alignItems:alignViewsBottom? 'flex-end':'center',
            flexDirection:isSender?'row-reverse':'row'
            }}>
        {(lastSender ? lastSender : lastMessageSent) && !isSender && <Image src={message.profile ?? '/images/profile_img.png'} width={profileIconSize} height={profileIconSize} alt='userImage' style={{width:profileIconSize,height:profileIconSize,borderRadius:'50%', objectFit:'cover', margin:'0px 10px',}} />}
        {chatElement()}
        {showTime && <p className='text-[10px] font-bold bottom-1 px-4'>{formatTime(message.timestamp)}</p>}
        </div>
    </div>
  )
}
