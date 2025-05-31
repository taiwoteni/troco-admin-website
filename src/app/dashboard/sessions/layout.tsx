'use client';

import LoadingLayout from '@/components/loading/LoadingLayout';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

import noSearchResultsAnim from "../../../../public/lottie/no-search-results.json"
import noGroupsAnim from "../../../../public/lottie/empty.json"
import { usePathname, useRouter } from 'next/navigation';
import Routes from '@/app/routes';
import { useAdmin } from '@/providers/AdminProvider';
import { SearchNormal1 } from 'iconsax-react';
import { Colors } from '@/utils/Colors';
import { useSessions } from '@/providers/SessionsProvider';
import { Session } from '@/utils/interfaces/session';
import SessionItemLayout from '@/components/sessions/SessionsItemLayout';
import { markAllMessagesAsRead } from '@/services/rest-api/sessions-api';

export default function SessionsLayout({children}:{children?: ReactNode}) {
    const {sessions} = useSessions();
    const {admin} = useAdmin();
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const filteredSessions = useMemo(()=>sessions.filter(session => session.user.email.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
        const aTime = new Date(a.messages.length === 0 ? a.lastActivity : a.messages[a.messages.length - 1].timestamp);
        const bTime = new Date(b.messages.length === 0 ? b.lastActivity: b.messages[b.messages.length - 1].timestamp);
    
        return bTime.getTime() - aTime.getTime();
    }),[sessions, search])

    const hasUnreadMessages = (session: Session) => {
        if(!admin || admin?.role.toLowerCase() === 'super admin' || pathname.includes(session._id)){
            return false;
        }
        
        return session.messages.filter((message) => !message.read).length !== 0;
    };

    // To automatically mark all the unread messages of the opened order
    useEffect(()=>{

        const currentSession = filteredSessions.find((f) => pathname.includes(f._id));
        if(!currentSession) return;

        markAllMessagesAsRead(currentSession._id)

    }, [filteredSessions, pathname])

  return (
    <div className="flex flex-1 w-full h-full px-8 py-2 pb-5 gap-5">
      <div className={`relative w-[40%] h-full bg-white rounded-2xl shadow-md box-border ${filteredSessions.length == 0? 'overflow-hidden':"overflow-y-scroll custom-scrollbar"}`}>
        <div className="p-4 pb-1 sticky top-0 z-10 bg-white">
          <p className="text-[24px]  font-bold py-4 pr-4">{"Your Sessions"}</p>
          <div className='relative w-full bg-tertiary rounded-2xl flex flex-center text-secondary'>
            <input
              type="text"
              placeholder="Search session by email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 pl-10 text-secondary text-[13.5px] font-quicksand rounded-lg outline-none bg-transparent"
            />
            <SearchNormal1 size={18} color={Colors.secondary} className="absolute z-[1] left-3 text-secondary" />
          </div>
          
        </div>
        
        {filteredSessions.map((session, index)=>(
            <div 
             key={session._id}
             onClick={()=>router.push(Routes.dashboard.sessions.path + "/" + session._id)}
             style={{marginTop: index === 0?'10px':0}}
             className={`hover:bg-tertiary ${pathname.includes(session._id)? 'bg-tertiary' : 'bg-white'}`}
             >
             <SessionItemLayout session={session} hasUnreadMessages={hasUnreadMessages(session)} />
            </div>
        ))}

        {filteredSessions.length === 0 && <LoadingLayout label={search.trim().length!==0? `No search results for "${search}"`:"No Sessions Yet"} lottie={search.trim().length!==0?noSearchResultsAnim:noGroupsAnim} style={{width:'100%', position:'absolute', background:'transparent', top:0, zIndex:1}} />}
      </div>
      <div className='flex-1 h-full'>
        {children}
      </div>
    </div>
  )
}
