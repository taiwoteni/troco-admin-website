'use client';

import LoadingLayout from '@/components/loading/LoadingLayout';
import { useGroups } from '@/hooks/groups-hook';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

import noSearchResultsAnim from "../../../../public/lottie/no-search-results.json"
import noGroupsAnim from "../../../../public/lottie/empty.json"
import { usePathname, useRouter } from 'next/navigation';
import Routes from '@/app/routes';
import GroupItemLayout from '@/components/groups/GroupItemLayout';
import { useAdmin } from '@/providers/AdminProvider';
import { SearchNormal1 } from 'iconsax-react';
import { Colors } from '@/utils/Colors';
import { Group } from '@/utils/interfaces/group';
import { markMessageAsRead } from '@/services/rest-api/chat-api';

export default function OrdersLayout({children}:{children?: ReactNode}) {
    const {groups} = useGroups();
    const {admin} = useAdmin();
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const filteredGroups = useMemo(()=>groups.filter(group => group.name.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
        const aTime = new Date(a.messages.length === 0 ? a.creationTime : a.messages[a.messages.length - 1].timestamp);
        const bTime = new Date(b.messages.length === 0 ? b.creationTime : b.messages[b.messages.length - 1].timestamp);
    
        return bTime.getTime() - aTime.getTime();
    }),[groups, search])

    const hasUnreadMessages = (order: Group) => {
        if(!admin || admin?.role.toLowerCase() === 'super admin' || pathname.includes(order._id)){
            return false;
        }
        
        return order.messages.filter((message) => !message.readBy.includes(admin!._id)).length !== 0;
    };

    // To automatically mark all the unread messages of the opened order
    useEffect(()=>{

        const currentGroup = filteredGroups.find(f => pathname.includes(f._id));
        if(!currentGroup) return;

        const unreadMessages = currentGroup.messages.filter(m =>admin!.role !== 'Super Admin' && !m.readBy.includes(admin!.role));

        Promise.all(unreadMessages.map(m => markMessageAsRead({messageId: m._id, groupId: currentGroup._id, userId: admin!._id})));

    }, [admin, filteredGroups, pathname])

  return (
    <div className="flex flex-1 w-full h-full px-8 py-2 pb-5 gap-5">
      <div className={`relative w-[40%] h-full bg-white rounded-2xl shadow-md box-border ${filteredGroups.length == 0? 'overflow-hidden':"overflow-y-scroll custom-scrollbar"}`}>
        <div className="p-4 pb-1 sticky top-0 z-10 bg-white">
          <p className="text-[24px]  font-bold py-4 pr-4">{admin?.role !== 'Admin'? 'All Orders' :"Your Orders"}</p>
          <div className='relative w-full bg-tertiary rounded-2xl flex flex-center text-secondary'>
            <input
              type="text"
              placeholder="Search Order by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 pl-10 text-secondary text-[13.5px] font-quicksand rounded-lg outline-none bg-transparent"
            />
            <SearchNormal1 size={18} color={Colors.secondary} className="absolute z-[1] left-3 text-secondary" />
          </div>
          
        </div>
        
        {filteredGroups.map((order, index)=>(
            <div 
             key={order._id}
             onClick={()=>router.push(Routes.dashboard.orders.path + "/" + order._id)}
             style={{marginTop: index === 0?'10px':0}}
             className={`hover:bg-tertiary ${pathname.includes(order._id)? 'bg-tertiary' : 'bg-white'}`}
             >
             <GroupItemLayout group={order} hasUnreadMessages={hasUnreadMessages(order)} />
            </div>
        ))}

        {filteredGroups.length === 0 && <LoadingLayout label={search.trim().length!==0? `No search results for "${search}"`:"No Groups Yet"} lottie={search.trim().length!==0?noSearchResultsAnim:noGroupsAnim} style={{width:'100%', position:'absolute', background:'transparent', top:0, zIndex:1}} />}
      </div>
      <div className='flex-1 h-full'>
        {children}
      </div>
    </div>
  )
}
