'use client';

import { getAllUsers, getOneUser, getUserReferralHistory, getWalletHistory } from "@/services/rest-api/user-api";
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { user } from "@/utils/interfaces/user";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type UsersAPI = {
    users: user[],
    reportedUsers: user[],
    refetch: ()=>Promise<void>
}

const UsersContext = createContext<UsersAPI | null>(null);

export const useUsers = ()=>{
    const context = useContext(UsersContext);

    if(!context) throw new Error('`useUsers` must be used within `UsersProvider`')

    return context;
}

export async function convertApiMethod<T>(method: Promise<AxiosResponse<ApiResponse<T>, unknown>>) : Promise<T> {
    const result = await method;

    return result.data.data;

}

export const useUser = (userId: string, loadOtherDetails?:boolean)=>{
    const queryClient = useQueryClient();
    const queries = useQueries({
        queries:[
            {
                queryKey: ['users', userId],
                queryFn: ()=>convertApiMethod(getOneUser(userId, true)),
                throwOnError: true,
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000

            },
            {
                queryKey: ['wallet', userId],
                enabled: loadOtherDetails ?? true,
                queryFn: ()=>convertApiMethod(getWalletHistory(userId, true)),
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000

            },
            {
                queryKey: ['referrals', userId],
                enabled: loadOtherDetails ?? true,
                queryFn: ()=>convertApiMethod(getUserReferralHistory(userId, true)),
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000

            },
        ]
    });
    const refresh = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:[['wallet', userId], ['referrals', userId], ['users', userId]]})
    }, [userId, queryClient])

    const [userQuery, walletQuery, referralQuery] = queries;

    return {user:userQuery.data, userLoading:userQuery.isPending, wallet:walletQuery.data, walletLoading: walletQuery.isPending, referrals:referralQuery.data, refresh};

}

export default function UsersProvider({children}:{children?: ReactNode}){
    const [users, setUsersRaw] = useState<user[]>([])
    const [reportedUsers, setReportedUsersRaw] = useState<user[]>([]);
    const queryClient = useQueryClient();

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:['users','reportedUsers']})
    },[queryClient])

    const fetchAllUsers = useCallback(async()=>{
        const res = await getAllUsers(true)

        return res.data.data.toReversed();
    },[])

    // const fetchReportedUsers = useCallback(async()=>{
    //     const res = await getReportedUsers(true)

    //     return res.data.reportedUsers.toReversed() ?? [];
    // },[])

    const usersQuery = useQuery({
         queryKey:['users'],
                queryFn:fetchAllUsers,
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000
    });

    const dataChanged = useCallback(()=>{
        return JSON.stringify(users) !== JSON.stringify(usersQuery.data);
    }, [usersQuery.data, users])

    const setUsers = useCallback((_users : user[])=>{
        setUsersRaw((prev) => _users ?? prev);
        setReportedUsersRaw((prev) => (_users ?? prev).filter(u => u.reports.count !== 0));
    },[])

    useEffect(()=>{
        if(!dataChanged()) return;

        setUsers(usersQuery.data!)
    },[dataChanged, setUsers, usersQuery.data])

    

    




    return (
        <UsersContext.Provider value={{users, reportedUsers, refetch}}>
            {children}
        </UsersContext.Provider>
    )
}