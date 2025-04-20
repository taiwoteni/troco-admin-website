'use client';

import { getTransactionStats, getUserStats, getWalletStats } from "@/services/rest-api/dashboard-api";
import { TransactionStats } from "@/utils/interfaces/transactions-stats";
import { UserStats } from "@/utils/interfaces/user-stats";
import { WalletStats } from "@/utils/interfaces/wallet-stats";
import { useQueries} from "@tanstack/react-query";
import { getWalletStats as getWallet, getTransactionStats as getTransactions, getUserStats as getUsers  } from "@/utils/storage/dashboard-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type DashboardAPI = {
    transactions: TransactionStats,
    users: UserStats,
    wallet: WalletStats,
}

const DashboardContext = createContext<DashboardAPI | null>(null);

export const useDashboardStats = ()=>{
    const context = useContext(DashboardContext);

    if(!context){
        throw Error("`useDashboardStats` can only be used within `DashboardProvider`");
    }

    return context;
}

export default function DashboardProvider({children}: {children?: ReactNode}){
    const [users, setUserStatsRaw] = useState<UserStats>(getUsers());
    const [wallet, setWalletStatsRaw] = useState<WalletStats>(getWallet());
    const [transactions, setTransactionStatsRaw] = useState<TransactionStats>(getTransactions())

    const getUserStatistics = useCallback(async()=>{
        const res = await getUserStats();
        return res.data;
    },[])

    const getWalletStatistics = useCallback(async()=>{
        const res = await getWalletStats();
        return res.data;
    },[])

    const getTransactionStatistics = useCallback(async()=>{
        const res = await getTransactionStats();
        return res.data;
    },[])

    const dashboardAnalytics = useQueries({
        queries: [
            {
              queryKey:['users-analytics', 1],
              notifyOnChangeProps: ['dataUpdatedAt', 'data'],
              refetchInterval: 5 * 1000,
              queryFn: getUserStatistics, 
            },
            {
              queryKey:['transactions-analytics', 2],
              notifyOnChangeProps: ['dataUpdatedAt', 'data'],
              refetchInterval: 5 * 1000,
              queryFn: getTransactionStatistics,
            },
            {
              queryKey:['wallet-analytics', 3],
              notifyOnChangeProps: ['dataUpdatedAt', 'data'],
              refetchInterval: 5 * 1000,
              queryFn: getWalletStatistics,
            },
        ]
    });

    const [userAnalytics, transactionAnalytics, walletAnalytics] = dashboardAnalytics;
    
    const dataChanged = useCallback(()=>{
            const userStatsChanged = JSON.stringify(userAnalytics.data) !== JSON.stringify(users)
            const transactionStatsChanged = JSON.stringify(transactionAnalytics.data) !== JSON.stringify(transactions);
            const walletStatsChanged = JSON.stringify(walletAnalytics.data) !== JSON.stringify(wallet);
            

    
            return userStatsChanged || transactionStatsChanged || walletStatsChanged;
        }, [transactionAnalytics, transactions, userAnalytics, users, wallet, walletAnalytics])

    
    const setStats = useCallback((stats: [UserStats, TransactionStats, WalletStats])=>{
        setUserStatsRaw(stats[0] ?? 0);
        setTransactionStatsRaw(stats[1] ?? 0)
        setWalletStatsRaw(stats[2] ?? 0)
    },[])

    useEffect(()=>{
        if(!dataChanged) return;

        setStats([userAnalytics.data!, transactionAnalytics.data!, walletAnalytics.data!])


    },[dataChanged, setStats, transactionAnalytics.data, userAnalytics.data, walletAnalytics.data])
    
    
    

    return (
        <DashboardContext.Provider value={{users, wallet, transactions}}>
            {children}
        </DashboardContext.Provider>
    )
}
