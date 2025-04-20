'use client'

import { transaction } from "@/utils/interfaces/transaction"
import { getTransactions, saveTransactions } from "@/utils/storage/transaction-storage"
import { useQueries, useQueryClient } from "@tanstack/react-query"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { useAdmin } from "./AdminProvider"
import { getOneAdminOrThrow } from "@/services/rest-api/admin-api"
import { getAllTransactions } from "@/services/rest-api/transaction-api"

type TransactionsAPI = {
    transactions: transaction[],
    allTransactions: transaction[],
    refetch: ()=>Promise<void>
}

const TransactionsContext = createContext<TransactionsAPI | null>(null);

export const useTransactions = ()=>{
    const context = useContext(TransactionsContext);

    if(!context) throw Error("`useTransactions` must be used within `TransactionsProvider`")

    return context; 
}

export default function TransactionsProvider({children}:{children?: ReactNode}){
    const [transactions, setTransactionsRaw] = useState<transaction[]>(getTransactions());
    const [allTransactions, setAllTransactionsRaw] = useState<transaction[]>([])
    const {admin} = useAdmin();
    const queryClient = useQueryClient();

    const fetchTransactions = useCallback(async()=>{
        if(!admin) return transactions;
        
        const result = await getOneAdminOrThrow(admin!._id);
        const adminData = result.data.data;
        
        return adminData.transactions;
    }, [admin, transactions])

    const fetchAllTransactions = useCallback(async()=>{
        const result = await getAllTransactions();

        return result.data.data;
    },[])

    const queries = useQueries({
        queries: [
            {
                queryKey: ['transactions', admin?._id],
                queryFn: fetchTransactions,
                refetchInterval: 3 * 1000,
                notifyOnChangeProps: ['data', 'dataUpdatedAt']
            },
            {
                queryKey: ['transactions'],
                queryFn: fetchAllTransactions,
                refetchInterval: 3 * 1000,
                notifyOnChangeProps: ['data', 'dataUpdatedAt']
            }
        ]
    });

    const [transactionsQuery, allTransactionsQuery] = queries;

    const dataChanged = useCallback(()=>{
        const transactionsChanged = JSON.stringify(transactionsQuery.data) !== JSON.stringify(transactions);
        const allTransactionsChanged = JSON.stringify(allTransactionsQuery.data) !== JSON.stringify(allTransactions);

        return transactionsChanged || allTransactionsChanged;

    }, [transactionsQuery, allTransactionsQuery, allTransactions, transactions])

    const setTransactions = useCallback((_transactions : [transaction[], transaction[]])=>{
        setTransactionsRaw((prev)=> _transactions[0] ?? prev);
        setAllTransactionsRaw((prev)=>_transactions[1] ?? prev);
    },[])

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:[['transactions', admin?._id],['transactions']]})
    },[admin?._id, queryClient])

    useEffect(()=>{
        if (!dataChanged()) return;

        setTransactions([transactionsQuery.data!, allTransactionsQuery.data!])
        
    },[allTransactionsQuery.data, dataChanged, setTransactions, transactionsQuery.data])
    useEffect(()=>{
        saveTransactions(transactions)
    },[transactions])


    return (
        <TransactionsContext.Provider value={{allTransactions, refetch, transactions}}>
            {children}
        </TransactionsContext.Provider>
    )
}