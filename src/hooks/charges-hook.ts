'use client';

import { convertApiMethod } from "@/providers/UserProvider";
import { getEscrowCharge} from "@/services/rest-api/transaction-api";
import { useQuery } from "@tanstack/react-query";

export const useEscrowCharges = ()=>{
    const query = useQuery({
        queryKey: ['charges'],
        queryFn:  ()=>convertApiMethod(getEscrowCharge()),
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });

    return {product: query.data?.find(charge => charge.category === 'product'), service: query.data?.find(charge => charge.category === 'service'), virtual: query.data?.find(charge => charge.category === 'virtual'),};
}