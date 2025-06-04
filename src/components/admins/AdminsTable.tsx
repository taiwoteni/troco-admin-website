'use client';

import { AdminRole } from '@/utils/interfaces/admin';
import React, { useMemo, useState } from 'react'
import AestheticTabbar from '../switch/AestheticTabbar';
import { useAdmins } from '@/hooks/admins-hook';
import Routes from '@/app/routes';
import { FaUser } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { distinctStringList } from '@/utils/ArrayUtil';
import { Colors } from '@/utils/Colors';

export default function AdminsTable({search}:{search:string}) {
    const menus : (AdminRole | 'All')[] = ['All', 'Admin', 'Super Admin', 'Secretary', 'Customer Care'];
    const [filter, setFilter] = useState<AdminRole | 'All'>('All')
    const router = useRouter()
    const admins = useAdmins();
    const filteredAdmins = useMemo(()=> admins.filter(admin =>admin.username.toLowerCase().includes(search.toLowerCase().trim()) && (filter == 'All' || admin.role === filter)),[filter, search, admins]) 
  return (
    <div className='rounded-lg shadow-lg w-full h-fit min-h-[400px] px-5 pb-5 bg-white mb-8'>
      <div className='flex items-center justify-between py-4 my-5'>
        <h1 className="text-[24px] font-bold">
            {filter === "All" && "All Admins"}
            {filter === "Super Admin" && "Super Admins"}
            {filter === "Customer Care" && "Customer Care"}
            {filter === "Secretary" && "Secretaries"}
            {filter === "Admin" && "Admins"}
        </h1>

        <div className='w-[500px]'>
            <AestheticTabbar className='h-[40px]' tabs={menus} onSelectTab={(index)=>setFilter(menus[index])} index={menus.indexOf(filter)} />
        </div>
      </div>

      <div className="w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden">
        <table className="w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden">
            <thead className="px-5 py-3 h-[60px] border-b">
                <tr className='bg-tertiary'>
                <th className="pl-5 py-3 text-start font-bold">
                    Names
                </th>
                <th className="py-3 text-center font-bold">
                    Category
                </th>
                <th className="py-3 text-center font-bold">
                    Email
                </th>
                <th className="py-3 text-center font-bold">
                    Groups/Sessions
                </th>
                <th className="py-3 text-center font-bold">
                    Transactions
                </th>
                <th className="py-3 text-center font-bold pr-3">
                    Blocked
                </th>
                </tr>
            </thead>
            <tbody>
                {
                filteredAdmins.length <=0 && (
                    <tr>
                    <td colSpan={6} className="text-center py-4">{search.trim().length !== 0? `No search results for '${search.trim()}'`:`No${filter === 'All'? "": " " + filter.charAt(0).toUpperCase() + filter.substring(1)} admins found`}</td>
                    </tr>
                )
                }
                {filteredAdmins.length !== 0 && (
                filteredAdmins.map((admin, index) => {
                    return <tr
                    key={index}
                    onClick={() => {
                    router.push(Routes.dashboard.allAdmin.path + "/" + admin._id);
                    }}
                    className="cursor-pointer hover:bg-tertiary font-quicksand font-[400] border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]"
                >
                    <td className="py-3 pl-3  overflow-hidden">
                    <div className="flex gap-2 items-center">
                        
                        <div className="rounded-full relative w-[36px] h-[36px] bg-gray-200 flex items-end justify-center">
                            <FaUser className="text-gray-400 text-[32px]" />
                            <div style={{backgroundColor:admin.active? Colors.themeColor:'red'}} className="absolute bottom-0 right-0 border-white border-[2px] rounded-full p-1 w-[40%] h-[40%]"/>
                        </div>
                        <p>{admin.username}</p>
                    </div>
                    </td>
                    <td className="py-3 text-center">{admin.role}</td>
                    <td className="py-3 text-center">{admin.email}</td>
                    <td className="py-3 text-center">
                      {(admin.role === 'Customer Care'? (admin.sessions ?? []) : (admin.groups ?? [])).length === 0? "None": distinctStringList(admin.role === 'Customer Care'? (admin.sessions ?? []) : (admin.groups ?? [])).length}
                    </td>
                    <td className="py-3 text-center">
                     {distinctStringList(admin.transactions).length === 0? "None":admin.transactions.length}
                    </td>
                    <td className="py-3 text-center">{admin.blocked? "Yes":"No"}</td>
                </tr>
                })
                )}
            </tbody>
        </table>
      </div>


    </div>
  )
}
