'use client'

import { transaction } from "@/utils/interfaces/transaction"
import { getTransactions, saveTransactions } from "@/utils/storage/transaction-storage"
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { useAdmin } from "./AdminProvider"
import { getOneAdminOrThrow } from "@/services/rest-api/admin-api"
import { getAllTransactions, getOneTransaction, getReportedTransactions } from "@/services/rest-api/transaction-api"
import { reportDetail } from "@/utils/interfaces/report"
import { convertApiMethod } from "./UserProvider"

type TransactionsAPI = {
    transactions: transaction[],
    allTransactions: transaction[],
    reportedTransactions: reportDetail[],
    refetch: ()=>Promise<void>
}

const TransactionsContext = createContext<TransactionsAPI | null>(null);

export const useTransactions = ()=>{
    const context = useContext(TransactionsContext);

    if(!context) throw Error("`useTransactions` must be used within `TransactionsProvider`")

    return context; 
}

export const useTransaction = (id: string)=>{
    const queryClient = useQueryClient();
    const transactionQuery = useQuery({
        queryKey: ['transactions', id],
        queryFn: ()=>convertApiMethod(getOneTransaction(id, )),
        throwOnError: true,
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000

    },);

    const refresh = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:['transactions', id]})
    }, [id, queryClient])


    return {transaction:transactionQuery.data, refresh};
}

export default function TransactionsProvider({children}:{children?: ReactNode}){
    const [transactions, setTransactionsRaw] = useState<transaction[]>(getTransactions());
    const [allTransactions, setAllTransactionsRaw] = useState<transaction[]>([])
    const [reportedTransactions, setReportedTransactionsRaw] = useState<reportDetail[]>([])
    const {admin} = useAdmin();
    const queryClient = useQueryClient();

    const fetchTransactions = useCallback(async()=>{
        if(!admin) return transactions;
        
        const result = await getOneAdminOrThrow(admin!._id);
        const adminData = result.data.data;
        
        return adminData.transactions;
    }, [admin, transactions])

     const fetchReportedTransactions = useCallback(async()=>{
        const result = await getReportedTransactions();

        return result.data.data;
    }, [])

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
                enabled: admin?.role !== 'Admin',
                refetchInterval: 3 * 1000,
                notifyOnChangeProps: ['data', 'dataUpdatedAt']
            }
            ,
            {
                queryKey: ['transactions', 'reported'],
                queryFn: fetchReportedTransactions,
                refetchInterval: 3 * 1000,
                notifyOnChangeProps: ['data', 'dataUpdatedAt']
            }
        ]
    });

    const [transactionsQuery, allTransactionsQuery, reportedTransactionsQuery] = queries;

    const dataChanged = useCallback(()=>{
        const transactionsChanged = JSON.stringify(transactionsQuery.data) !== JSON.stringify(transactions);
        const allTransactionsChanged = JSON.stringify(allTransactionsQuery.data) !== JSON.stringify(allTransactions)
        const reportedTransactionsChanged = JSON.stringify(reportedTransactionsQuery.data) !== JSON.stringify(reportedTransactions)

        return transactionsChanged || allTransactionsChanged || reportedTransactionsChanged;

    }, [transactionsQuery, allTransactionsQuery, reportedTransactionsQuery, reportedTransactions, allTransactions, transactions])

    const setTransactions = useCallback((_transactions : [transaction[], transaction[], reportDetail[]])=>{
        setTransactionsRaw((prev)=> _transactions[0] ?? prev);
        setAllTransactionsRaw((prev)=>_transactions[1] ?? prev);
        setReportedTransactionsRaw((prev)=>_transactions[2] ?? prev);
    },[])

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:[['transactions', admin?._id],['transactions'], ['transactions', 'reported']]})
    },[admin?._id, queryClient])

    useEffect(()=>{
        if (!dataChanged()) return;

        setTransactions([transactionsQuery.data!, allTransactionsQuery.data!, reportedTransactionsQuery.data!])
        
    },[allTransactionsQuery.data, dataChanged, setTransactions, transactionsQuery.data, reportedTransactionsQuery.data])

    useEffect(()=>{
        // Super admins cannot save transactions because they oversee all transactions
        if(admin?.role  === 'Super Admin') return;
        saveTransactions(transactions)
    },[transactions, admin])


    return (
        <TransactionsContext.Provider value={{allTransactions, reportedTransactions, refetch, transactions}}>
            {children}
        </TransactionsContext.Provider>
    )
}