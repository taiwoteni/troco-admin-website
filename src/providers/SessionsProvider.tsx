'use client'

import { Session } from "@/utils/interfaces/session"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { useAdmin } from "./AdminProvider";
import { getChatSessions, getSessionMessages } from "@/services/rest-api/sessions-api";

interface SessionsAPI{
    sessions: Session[],
    refetch: ()=>Promise<void>,
}

const SessionsContext = createContext<SessionsAPI | null>(null);

export const useSessions = ()=>{
    const context = useContext(SessionsContext)

    if(!context) throw new Error("`useSessions` must be used within `SessionsProvider`")

    return context;
}

export const useSession = (sessionId: string)=>{
    const {sessions} = useSessions()
    return sessions.find( s => s._id === sessionId);
}

export const useMessages = (sessionId: string)=>{
    const {admin} = useAdmin();

    const fetchMessages = useCallback(async()=>{
        const result = await getSessionMessages(sessionId, true);

        return result.data.chatSession?.messages;
    },[sessionId])

    const query = useQuery({
        queryKey: ['sessions', admin?._id, sessionId],
        enabled: !!admin && admin.role === 'Customer Care',
        queryFn: fetchMessages,
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });

    return query.data ?? [];
}

export function SessionsProvider({children}:{children?: ReactNode}){
    const {admin} = useAdmin();
    const [sessions, setSessionsRaw] = useState<Session[]>([]);
    const queryClient = useQueryClient();

    const fetchSessions = useCallback(async()=>{
        const result = await getChatSessions(admin?._id ?? '', true);

        return result.data.chatsession;
    },[admin])

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:[['sessions', admin?._id]]})
    },[queryClient, admin])

    const query = useQuery({
        queryKey: ['sessions', admin?._id],
        enabled: !!admin && admin.role === 'Customer Care',
        queryFn: fetchSessions,
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });

    const dataChanged = useCallback(()=>{
        return JSON.stringify(sessions) !== JSON.stringify(query.data ?? []);
    }, [query.data, sessions])

    useEffect(()=>{
        if(!query.data) return;
        if(!dataChanged()) return;

        setSessionsRaw(query.data);


    },[dataChanged, query.data])
    

    return (
      <SessionsContext.Provider value={{refetch,sessions}}>{children}</SessionsContext.Provider>
    )
}