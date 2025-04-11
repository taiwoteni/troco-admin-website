'use client';

import Routes from '@/app/routes';
import { logoutAdmin } from "@/services/rest-api/auth-api";
import Admin from "@/utils/interfaces/admin"
import { getAdminDetails } from "@/utils/storage/admin-storage";
import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useState } from "react"

type AdminAPI = {
    admin?: Admin,
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
    const router = useRouter();

    const setAdmin = useCallback((admin?: Admin)=>{
        setAdminRaw(admin);
    }, []);

    const logout = useCallback( async ()=>{
        if(!admin?._id){
            router.push(Routes.auth.path);
        }
        const result = await logoutAdmin(admin!._id);
        if(result.status === 200){
            setAdmin(undefined)
            router.push(Routes.auth.path);
            return;
        }
    },[admin, router, setAdmin])


  return (
    <AdminContext.Provider value={{admin, setAdmin, logout}}>
        {children}
    </AdminContext.Provider>
  )
}