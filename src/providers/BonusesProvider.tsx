'use client';

import { getAllBonuses } from "@/services/rest-api/bonuses-api";
import { bonus } from "@/utils/interfaces/bonus";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { convertApiMethod } from "./UserProvider";

type BonusAPI = {
    bonuses: bonus[],
    refetch: ()=>Promise<void>
}

const BonusContext = createContext<BonusAPI | null>(null);

export const useBonuses = ()=>{
    const context = useContext(BonusContext);

    if(!context) throw new Error('`useBonuses` must be used within `BonusesProvider`')

    return context;
}


export const useBonus = (bonusId: string)=>{
    const {bonuses} = useBonuses();
    const bonus = bonuses.find(b => b._id === bonusId);

    return bonus;
}

export default function BonusesProvider({children}:{children?: ReactNode}){
    const [bonuses, setBonusesRaw] = useState<bonus[]>([])
    const queryClient = useQueryClient();

    const refetch = useCallback(async()=>{
        await queryClient.refetchQueries({queryKey:['bonuses']})
    },[queryClient])

    const bonusesQuery = useQuery({
                queryKey:['bonuses'],
                queryFn:()=>convertApiMethod(getAllBonuses()),
                notifyOnChangeProps: ['data', 'dataUpdatedAt'],
                refetchInterval: 3.1 * 1000
            },);

    const dataChanged = useCallback(()=>{
        return JSON.stringify(bonuses) !== JSON.stringify(bonusesQuery.data) ;
    }, [bonusesQuery.data, bonuses])

    const setBonuses = useCallback((_bonuses?: bonus[])=>{
        setBonusesRaw((prev) => _bonuses ?? prev);
    },[])

    useEffect(()=>{
        if(!dataChanged()) return;

        setBonuses(bonusesQuery.data)
    },[dataChanged, setBonuses, bonusesQuery.data])

    

    




    return (
        <BonusContext.Provider value={{bonuses, refetch}}>
            {children}
        </BonusContext.Provider>
    )
}