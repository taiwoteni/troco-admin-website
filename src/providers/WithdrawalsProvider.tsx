'use client';

import { withdrawal } from "@/utils/interfaces/withdrawal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { convertApiMethod } from "./UserProvider";
import { getAllWithdrawals } from "@/services/rest-api/withdrawal-api";

type WithdrawalAPI = {
   withdrawals: withdrawal[],
   refetch: ()=>Promise<void>
}

const WithdrawalContext = createContext<WithdrawalAPI | null>(null);

export const useWithdrawals = ()=>{
    const context = useContext(WithdrawalContext);

    if(!context) throw new Error('`useWithdrawals` must be used within `WithdrawalsProvider`')

    return context;
}

export const useWithdrawal = (withdrawalId: string)=>{
    const {withdrawals} = useWithdrawals();
    const withdrawal = withdrawals.find(b => b._id === withdrawalId);

    return withdrawal;
}

export default function WithdrawalsProvider({children}:{children?: ReactNode}){
    const [withdrawals, setWithdrawalsRaw] = useState<withdrawal[]>([])
    const queryClient = useQueryClient();

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:['bonuses']})
    },[queryClient])

    const withdrawalsQuery = useQuery({
                queryKey:['withdrawals'],
                queryFn:()=>convertApiMethod(getAllWithdrawals()),
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000
            },);

    const dataChanged = useCallback(()=>{
        return JSON.stringify(withdrawals) !== JSON.stringify(withdrawalsQuery.data) ;
    }, [withdrawalsQuery.data, withdrawals])

    const setWithdrawals = useCallback((_withdrawals?: withdrawal[])=>{
        setWithdrawalsRaw((prev) => _withdrawals ?? prev);
    },[])

    useEffect(()=>{
        if(!dataChanged()) return;

        setWithdrawals(withdrawalsQuery.data)
    },[dataChanged, setWithdrawals, withdrawalsQuery.data])

    return (
        <WithdrawalContext.Provider value={{withdrawals, refetch}}>
            {children}
        </WithdrawalContext.Provider>
    )
}