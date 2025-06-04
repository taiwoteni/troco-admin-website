'use client';


import DashboardCard from '@/components/cards/DashboardCard';
import SearchBar from '@/components/search-bar/SearchBar';
import UsersTable from '@/components/users/UsersTable';
import { useDashboardStats } from '@/providers/DashboardProvider';
import { formatDigits } from '@/utils/Format';
import React, { useState } from 'react'

export default function UsersPage() {
  const {users:{businessAccounts, companyAccounts, personalAccounts, merchantAccounts}} = useDashboardStats()
  const [search, setSearch] = useState('');
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-2'>
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <div className='w-full flex justify-between'>
          <p className='text-secondary text-[26px] font-bold'>Users</p>
          <SearchBar placeholder='Search By Name or Category' value={search} onChangeText={setSearch}/>
        </div>
          {/* Analysis Cards */}
          <div className="w-full h-fit flex flex-wrap gap-4">
            <DashboardCard 
              label='Personal Accounts'
              value={formatDigits(personalAccounts)}
              background='brown'
              icon={'/icons/dashboard/users.svg'}
            />
            <DashboardCard 
              label='Merchant Accounts'
              value={formatDigits(merchantAccounts)}
              background='#2196F3'
              top={false}
              bottom={true}
              icon={'/icons/dashboard/merchant-icon.svg'}
            />
            <DashboardCard 
              label='Business Accounts'
              value={formatDigits(businessAccounts)}
              background='#9C27B0'
              icon={'/icons/dashboard/business-icon.svg'}
            />
            <DashboardCard 
              label='Company Accounts'
              value={formatDigits(companyAccounts)}
              top={false}
              background='#FF6E40FF'
              bottom={true}
              icon={'/icons/dashboard/company-icon.svg'}
            />
          </div>

          <UsersTable search={search} />

      </div>
    </div>
  )
}
