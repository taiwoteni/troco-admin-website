import { useAdmin } from "@/providers/AdminProvider";
import { convertApiMethod } from "@/providers/UserProvider";
import { getAllGroups } from "@/services/rest-api/order-api";
import { Group } from "@/utils/interfaces/group";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

type returnType = {
    groups: Group[],
    refresh: ()=>Promise<void>
};

export const useGroups = () : returnType =>{
    const {admin, groups, refetch} = useAdmin();

    const queryClient = useQueryClient();
    const query = useQuery({
        enabled: !!admin && admin.role !== 'Admin',
        queryKey: ['orders'],
        queryFn: ()=> convertApiMethod(getAllGroups(true)),
        notifyOnChangeProps: ['data', 'dataUpdatedAt'],
        refetchInterval: 3.1 * 1000
    });


    if(!admin) return {groups: [], refresh: refetch};
    if(admin.role === 'Admin') return {groups, refresh:refetch};

    return {groups: query.data ?? [], refresh:()=> queryClient.refetchQueries({queryKey:['orders']})}
}

export const useGroup = (id:string)=>{
    const {groups} = useGroups();
    const tempGroup = useMemo(()=>groups.find(g => g._id === id), [groups, id])

    return tempGroup;

}