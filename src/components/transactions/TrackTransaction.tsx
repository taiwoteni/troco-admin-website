'use client'
import React, { useState } from 'react'
import {FaSpinner} from 'react-icons/fa';
import trackTransactionAnim from "../../../public/lottie/plane-cloud.json"
import noResultsAnim from "../../../public/lottie/no-search-results.json"
import { Colors } from "@/utils/Colors";
import Transaction, { TransactionStatus } from "@/utils/interfaces/transaction";
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Routes from '@/app/routes';
import { getOneTransactionOrError } from '@/services/rest-api/transaction-api';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


interface props{
    onCancel:()=>void,
}
export default function TrackTransaction({onCancel}:props) {
    const [trackedTransaction, setTrackedTransaction] = useState<Transaction | null>(null)
    const [trackedId, setTrackedId] = useState<string | null>(null);
    const router = useRouter();


    // This is a mutation hook that is called to track the transaction
    // If it can't find the transaction given, the onError function is triggered
    // which in turn, sets the previously tracked transaction to null.
    const trackTransactionMutation = useMutation({
        mutationFn: ()=>{
            return getOneTransactionOrError(trackedId!);
        },
        onSuccess: ({data})=>{
            setTrackedTransaction(new Transaction(data.data));
        },
        onError: ()=>{
            setTrackedTransaction(null);
        }
    })

    function trackTransaction(){
        if(trackedId === null || trackedId === "" ){
          return;
        }
    
        if(trackedId.startsWith("#")){
          setTrackedId(trackedId.substring(1))
        }
    
       trackTransactionMutation.mutate();
    }


    function ResultItem({transaction=true}:{transaction?:boolean}):React.JSX.Element{
        return <div
            onClick={()=>{
                if(transaction){
                    router.push(Routes.dashboard.transactions.path + "/" + trackedId);
                    onCancel()
                    return;
                }
                router.push(Routes.dashboard.group.path + "/" + trackedId);
                onCancel()

            }}
            className='flex border-b-2 py-2 px-4 cursor-pointer gap-3 last:border-none'>
            <div
                className="w-[47px] h-[47px] rounded-[50%] flex items-center justify-center"
                style={{ backgroundColor: "#e8fce8" }}>
                    <Image
                        src={transaction ? "/icons/transaction/transaction.svg":"/icons/dashboard/group.svg"}
                        alt="Icon"
                        width={24}
                        height={24}
                    />
            </div>

            <div className='flex flex-col justify-center gap-[2px]'>
                <p className="font-semibold" style={{ fontSize: "14.25px" }}>
                {transaction? trackedTransaction?.transactionName : trackedTransaction?.rawData.groupName}
                </p>

                <p
                    className="text-gray-500"
                    style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {transaction? "View the transaction" :"View the Group."}
                </p>
            </div>
        </div>
    }


    return (
        <div className="absolute top-8 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-fit h-fit">
            <div className="pt-5 px-5 h-[400px] w-[400px] flex flex-col gap-3">
                <p className="font-bold text-[20px] mb-2">Track Transaction</p>
                <div className="flex gap-4">
                    <input onChange={(e)=>{
                        if(trackTransactionMutation.isError || trackTransactionMutation.isSuccess){
                            trackTransactionMutation.reset();
                        }
                        
                        setTrackedId(e.target.value.trim().toLowerCase());
                    }} style={{backgroundColor:Colors.tertiary}} className="flex-1 text-[12px] outline-none border-none rounded-[15px] px-4 py-3" placeholder="Enter ID" />
                    <button onClick={trackTransaction} className="text-white text-[11px] outline-none border-none rounded-[9px] px-5 py-2" style={{backgroundColor:Colors.themeColor}}>{trackTransactionMutation.isPending?<FaSpinner className='animate-spin'/> : "Track"}</button>
                </div>
                {trackedTransaction && <div className="flex flex-col gap-3">
                    <ResultItem key={'transaction'} />
                    {trackedTransaction.transactionStatus !== TransactionStatus.Completed && (
                        <ResultItem key={"group"} transaction={false} />
                    )}
                </div>}
                {!trackedTransaction && <div className="flex flex-1 flex-col justify-center items-center gap-1 text-center text-gray-500 text-[14px]">
                    <Lottie animationData={trackTransactionMutation.isError? noResultsAnim :trackTransactionAnim} className='object-cover' height={120} width={120} />
                    <p>{trackTransactionMutation.isError? `No transaction matching "#${trackedId}"` : "Track a transaction."}</p>
                </div>}
            </div>
        </div>
    )
}
