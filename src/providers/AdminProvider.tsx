'use client';

import Routes from '@/app/routes';
import PopupModal from '@/components/modal/PopupModal';
import { getOneAdminOrThrow } from '@/services/rest-api/admin-api';
import { logoutAdmin } from "@/services/rest-api/auth-api";
import Admin from "@/utils/interfaces/admin"
import CustomerCareSession from '@/utils/interfaces/customer-care-session';
import { Group } from '@/utils/interfaces/group';
import Notification from '@/utils/interfaces/Notification';
import { getAdminDetails, saveAdminDetails } from "@/utils/storage/admin-storage";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"

type AdminAPI = {
    admin?: Admin,
    notifications: Notification[],
    groups: Group[],
    customerCareSessions: CustomerCareSession[],
    refetch: ()=>Promise<void>,
    setAdmin: (admin: Admin) => void,
    logout: ()=> Promise<void>,
}

const AdminContext = createContext<AdminAPI | null>(null);

export const useAdmin = ()=>{
    const context = useContext(AdminContext)
    if(!context){
        throw new Error("`useAdmin` must be used within AdminProvider");
    }

    return context;
}

export default function AdminProvider({children}: {children?: ReactNode}) {
    const [admin, setAdminRaw] = useState<Admin | undefined>(getAdminDetails());
    const [notifications, setNotificationsRaw] = useState<Notification[]>([])
    const [show, showLogoutModel] = useState(false);
    const [groups, setGroupsRaw] = useState<Group[]>([])
    const [customerCareSessions, setSessionsRaw] = useState<CustomerCareSession[]>([])
    const router = useRouter();
    const client = useQueryClient();

    const getAdmin = useCallback(async()=>{
        const res = await getOneAdminOrThrow(admin!._id);

        const fullAdminData = res.data.data;
        return fullAdminData;
    },[admin])

    const {data: adminData} = useQuery({
        queryKey: ['admin'],
        queryFn: getAdmin,
        enabled: !!admin,
        notifyOnChangeProps: ['dataUpdatedAt', 'data'],
        refetchInterval: 3 * 1000
    });

    const adminDataChanged = useCallback(()=>{
        const notifChanged = JSON.stringify(adminData?.notifications) !== JSON.stringify(notifications)
        const groupsChanged = JSON.stringify(adminData?.groups) !== JSON.stringify(groups);
        const sessionsChanged = JSON.stringify(adminData?.sessions) !== JSON.stringify(customerCareSessions);
        const compactAdmin = {...adminData,
            transactions: adminData?.transactions.map(t => t._id) ?? [],
            sessions: adminData?.sessions?.map(s => s._id ) ?? [],
            groups: adminData?.groups.map(g => g._id) ?? [],
            activity: [],
            notifications: adminData?.notifications.map(n => n._id) ?? []
        };
        const adminChanged = JSON.stringify(compactAdmin) !== JSON.stringify(admin)

        return adminChanged || notifChanged || groupsChanged || sessionsChanged;
    }, [adminData, notifications, groups, customerCareSessions, admin])



    const setAdmin = useCallback((admin?: Admin)=>{
        setAdminRaw(admin);
        saveAdminDetails(admin);
    }, []);

    const setGroups = useCallback((groups: Group[])=>{
        setGroupsRaw(groups);
    }, []);
    const setNotifications = useCallback((notifs: Notification[])=>{
        setNotificationsRaw(notifs);
    }, []);
    const setSessions = useCallback((sessions: CustomerCareSession[])=>{
        setSessionsRaw(sessions);
    }, []);
    const refetch = useCallback(()=>client.refetchQueries({queryKey: ['admin']}),[client]);

    const logout = useCallback(async ()=>{
       showLogoutModel(true)
    },[])

    const signOut = useCallback(async ()=>{
         if(!admin?._id){
            router.push(Routes.auth.path);
            showLogoutModel(false);
            return;
        }
        const result = await logoutAdmin(admin!._id);
        if(result.status === 200){
            setAdmin(undefined)
            router.push(Routes.auth.path);
            showLogoutModel(false)
        }
    }, [admin, router, setAdmin])

    useEffect(()=>{
        if(!admin || !adminData) return;
        if(!adminDataChanged()) return;
        setAdmin({...adminData,
            transactions: adminData.transactions.map(t => t._id),
            sessions: adminData.sessions?.map(s => s._id ) ?? [],
            groups: adminData.groups.map(g => g._id),
            activity: [],
            notifications: adminData.notifications.map(n => n._id)
        })
        setGroups(adminData.groups)
        setSessions(adminData.sessions);
        setNotifications(adminData.notifications)
    }, [adminData, admin, setAdmin, setGroups, setSessions, setNotifications, adminDataChanged])


  return (
    <AdminContext.Provider value={{admin, setAdmin, logout, customerCareSessions, groups, notifications, refetch}}>
        <>
         {children}
         {show && <PopupModal
            modal={{
                title: "Logout",
                question: "Are you sure you want to logout of this account?",
                negative: true,
                okText: "Yes",
                cancelText: "No",
                onCancel: ()=>showLogoutModel(false),
                onOk: signOut
            }}
         />}
        </>
    </AdminContext.Provider>
  )
}