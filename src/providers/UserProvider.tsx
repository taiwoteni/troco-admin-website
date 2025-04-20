'use client';

import { getAllUsers } from "@/services/rest-api/user-api";
import { user } from "@/utils/interfaces/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type UsersAPI = {
    users: user[],
    refetch: ()=>Promise<void>
}

const UsersContext = createContext<UsersAPI | null>(null);

export const useUsers = ()=>{
    const context = useContext(UsersContext);

    if(!context) throw new Error('`useUsers` must be used within `UsersProvider`')

    return context;
}

export default function UsersProvider({children}:{children?: ReactNode}){
    const [users, setUsersRaw] = useState<user[]>([])
    const queryClient = useQueryClient();

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:['users']})
    },[queryClient])

    const fetchAllUsers = useCallback(async()=>{
        const res = await getAllUsers(true)

        return res.data.data;
    },[])

    const {data} = useQuery({
        queryKey:['users'],
        queryFn:fetchAllUsers,
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });

    const dataChanged = useCallback(()=>{
        return JSON.stringify(users) !== JSON.stringify(data);
    }, [data, users])

    useEffect(()=>{
        if(!data) return;
        if(!dataChanged()) return;

        setUsersRaw(data)
    },[data, dataChanged])




    return (
        <UsersContext.Provider value={{users, refetch}}>
            {children}
        </UsersContext.Provider>
    )
}