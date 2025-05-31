'use client';

import { convertApiMethod } from "@/providers/UserProvider";
import { getAllAdmins } from "@/services/rest-api/admin-api";
import { useQuery } from "@tanstack/react-query";

export const useAdmins = ()=>{
    const query = useQuery({
        queryKey: ['admins'],
        queryFn:  ()=>convertApiMethod(getAllAdmins()),
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });

    return query.data ?? [];
}